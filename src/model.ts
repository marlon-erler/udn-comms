import * as React from "bloatless-react";

import {
  arrayToUint8,
  decode,
  decrypt,
  encrypt,
  generateIV,
  importKey,
  splitMergedString,
  uInt8ToArray,
} from "./cryptUtility";

import UDNFrontend from "udn-frontend";
import { translation } from "./translations";

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
  [serverAddress, currentAddress, isConnected],
  () =>
    serverAddress.value == "" ||
    (currentAddress.value == serverAddress.value && isConnected.value == true)
);

// encryption
export const encryptionKey = React.restoreState("encryption-key", "");
export const isEncryptionUnavailable = window.crypto.subtle == undefined;

// sending
export const currentPrimaryChannel = new React.State("");
export const primaryChannel = React.restoreState("primary-channel", "");
export const newSecondaryChannelName = new React.State("");
export const secondaryChannels =
  React.restoreListState<Channel>("secondary-channels");
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
  isConnected.value = false;
  UDN.connect(serverAddress.value);
}

export async function sendMessage(): Promise<void> {
  if (cannotSendMessage.value == true) return;

  // get channels
  const secondaryChannelNames: string[] = [
    ...secondaryChannels.value.values(),
  ].map((channel) => channel.channelName);
  const allChannelNames: string[] = [
    primaryChannel.value,
    ...secondaryChannelNames,
  ];

  // encrypt
  const encrypted = await encryptMessage();
  if (encrypted == undefined) return;

  // create object
  const joinedChannelName = allChannelNames.join("/");
  const messageObject = new Message(
    joinedChannelName,
    senderName.value,
    encrypted,
    new Date().toISOString()
  );
  const messageString = JSON.stringify(messageObject);

  // send
  UDN.sendMessage(joinedChannelName, messageString);

  // clear
  messageBody.value = "";
}

export function clearMessageHistory() {
  messages.clear();
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
  setChannel();
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
  if (isSubscribed == true) {
    currentPrimaryChannel.value = channel;
  }
}

async function handleMessage(body: string): Promise<void> {
  try {
    const object: Message = JSON.parse(body);
    if (!object.channel || !object.sender || !object.body || !object.isoDate)
      return;

    const messageObject = new Message(
      object.channel,
      object.sender,
      await decryptMessage(object.body),
      object.isoDate
    );
    messages.add(messageObject);
  } catch {}
}

async function encryptMessage(): Promise<string> {
  if (encryptionKey.value == "") return messageBody.value;

  if (!window.crypto.subtle) return messageBody.value;

  const iv = generateIV();
  const key = await importKey(encryptionKey.value, "encrypt");
  const encryptedArray = await encrypt(iv, key, messageBody.value);

  const encryptionData = {
    iv: uInt8ToArray(iv),
    encryptedArray: uInt8ToArray(encryptedArray),
  };
  return btoa(JSON.stringify(encryptionData));
}

async function decryptMessage(encryptionData: string): Promise<string> {
  try {
    const encrypionData = JSON.parse(atob(encryptionData));
    const iv = arrayToUint8(encrypionData.iv);
    const encryptedArray = arrayToUint8(encrypionData.encryptedArray);

    const key = await importKey(encryptionKey.value, "decrypt");
    return await decrypt(iv, key, encryptedArray);
  } catch (error) {
    console.error(error);
    return encryptionData;
  }
}
