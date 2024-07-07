import * as React from "bloatless-react";

import UDNFrontend from "udn-frontend";

const UDN = new UDNFrontend();

// TYPE
export class Channel implements React.Identifiable {
  id = React.UUID();
  constructor(public channelName: string) {}
}

export interface Message extends React.Identifiable {
  channel: string;
  sender: string;
  body: string;
  isoDate: string;
}

export class Message implements React.Identifiable {
  id = React.UUID();

  constructor(
    public channel: string,
    public sender: string,
    public body: string,
    public isoDate: string
  ) {}
}

// STATE
// connection
export const currentAddress = new React.State("");
export const serverAddress = React.restoreState("socket-address", "");
export const isConnected = new React.State(false);

export const cannotConnect = React.createProxyState(
  [serverAddress, isConnected],
  () =>
    serverAddress.value == "" ||
    (currentAddress.value == serverAddress.value && isConnected.value == true)
);

// sending
export const currentPrimaryChannel = new React.State("");
export const primaryChannel = React.restoreState("primary-channel", "");
export const newSecondaryChannelName = new React.State("");
export const secondaryChannels =
  React.restoreListState<Channel>("secondary-channels");
export const encryptionKey = React.restoreState("encryption-key", "");
export const senderName = React.restoreState("sender-name", "");
export const messageBody = React.restoreState("message", "");

export const cannotSetChannel = React.createProxyState(
  [primaryChannel, currentPrimaryChannel, isConnected],
  () =>
    primaryChannel.value == "" ||
    primaryChannel.value == currentPrimaryChannel.value ||
    isConnected.value == false
);

export const cannotAddSecondaryChannel = React.createProxyState(
  [newSecondaryChannelName],
  () => newSecondaryChannelName.value == ""
);

export const cannotSendMessage = React.createProxyState(
  [currentPrimaryChannel, messageBody, senderName],
  () =>
    currentPrimaryChannel.value == "" ||
    messageBody.value == "" ||
    senderName.value == ""
);

// receiving
export const messages = React.restoreListState<Message>("messages");

// METHODS
export function connect() {
  if (cannotConnect.value == true) return;
  currentAddress.value = serverAddress.value;
  UDN.connect(serverAddress.value);
}

export function sendMessage() {
  if (cannotSendMessage.value == true) return;

  // get channels
  const secondaryChannelNames: string[] = [
    ...secondaryChannels.value.values(),
  ].map((channel) => channel.channelName);
  const allChannelNames: string[] = [
    primaryChannel.value,
    ...secondaryChannelNames,
  ];

  // create object
  const joinedChannelName = allChannelNames.join("/");
  const messageObject = new Message(
    joinedChannelName,
    senderName.value,
    messageBody.value,
    new Date().toISOString()
  );
  const messageString = JSON.stringify(messageObject);

  // send
  UDN.sendMessage(joinedChannelName, messageString);

  // clear
  messageBody.value = "";
}

export function setChannel(): void {
  if (cannotSetChannel.value == true) return;

  if (currentPrimaryChannel != undefined) {
    UDN.unsubscribe(currentPrimaryChannel.value);
  }
  UDN.subscribe(primaryChannel.value);
}

export function addSecondaryChannel(): void {
  if (cannotAddSecondaryChannel.value == true) return;

  const channelObject = new Channel(newSecondaryChannelName.value);
  secondaryChannels.add(channelObject);
  newSecondaryChannelName.value = "";
}

export function removeSecondaryChannel(channel: Channel): void {
  secondaryChannels.remove(channel);
}

// LISTENERS
UDN.onconnect = () => {
  isConnected.value = true;
};

UDN.onmessage = (data) => {
  if (data.subscribed != undefined && data.messageChannel != undefined) {
    return handleSubscriptionConfirmation(data.messageChannel, data.subscribed);
  } else if (data.messageBody) {
    handleMessage(data.messageBody);
  }
};

UDN.ondisconnect = () => {
  isConnected.value = false;
};

// UTILITY
function handleSubscriptionConfirmation(
  channel: string,
  isSubscribed: boolean
): void {
  console.log(channel, isSubscribed);
  if (isSubscribed == true) {
    currentPrimaryChannel.value = channel;
  }
}

function handleMessage(body: string): void {
  try {
    const object: Message = JSON.parse(body);
    if (!object.channel || !object.sender || !object.body || !object.isoDate)
      return;

    const messageObject = new Message(
      object.channel,
      object.sender,
      object.body,
      object.isoDate
    );
    messages.add(messageObject);
  } catch {}
}
