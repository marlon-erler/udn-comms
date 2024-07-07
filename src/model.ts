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
export const socketAddress = React.restoreState("socket-address", "");
export const isConnected = new React.State(false);

// sending
let currentChannel: string | undefined = undefined;
export const primaryChannel = React.restoreState("primary-channel", "");
export const newAdditionalChannelName = new React.State("");
export const additionalChannels = React.restoreListState<Channel>(
  "additional-channels"
);
export const encryptionKey = React.restoreState("encryption-key", "");
export const senderName = React.restoreState("sender-name", "");
export const message = React.restoreState("message", "");

export const cannotSendMessage = React.createProxyState(
  [primaryChannel, message],
  () => primaryChannel.value == "" || message.value == ""
);

// receiving
export const messages = React.restoreListState<Message>("messages");

// METHODS
export function connect() {
  UDN.connect(socketAddress.value);
}

export function send() {
  if (cannotSendMessage.value == true) return;

  // get channels
  const additionalChannelNames: string[] = [
    ...additionalChannels.value.values(),
  ].map((channel) => channel.channelName);
  const allChannelNames: string[] = [
    primaryChannel.value,
    ...additionalChannelNames,
  ];

  // create object
  const joinedChannelName = allChannelNames.join("/");
  const messageObject = new Message(
    joinedChannelName,
    senderName.value,
    message.value,
    new Date().toISOString()
  );
  const messageString = JSON.stringify(messageObject);

  UDN.sendMessage(joinedChannelName, messageString);
}

export function setChannel(): void {
  if (currentChannel != undefined) {
    UDN.unsubscribe(currentChannel);
  }
  UDN.subscribe(primaryChannel.value);
}

export function addAdditionalChannel(): void {
  const channelObject = new Channel(newAdditionalChannelName.value);
  additionalChannels.add(channelObject);
}

export function removeAdditionalChannel(channel: Channel): void {
  additionalChannels.remove(channel);
}

// LISTENERS
UDN.onconnect = () => {
  isConnected.value = true;
};

UDN.onmessage = (data) => {
  if (data.subscribed && data.messageChannel) {
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
  if (isSubscribed == true) {
    currentChannel = channel;
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
