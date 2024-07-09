import * as React from "bloatless-react";

import { Chat, chats } from "./chatModel";

import UDNFrontend from "udn-frontend";

export const UDN = new UDNFrontend();

// CONNECTION
// state
export const currentAddress = new React.State("");
export const isConnected = new React.State(false);

export const serverAddressInput = React.restoreState("socket-address", "");

export const cannotDisonnect = React.createProxyState(
  [isConnected],
  () => isConnected.value == false
);

export const cannotConnect = React.createProxyState(
  [serverAddressInput, currentAddress, isConnected],
  () =>
    serverAddressInput.value == "" ||
    (currentAddress.value == serverAddressInput.value &&
      isConnected.value == true)
);

// methods
export function connect(): void {
  if (cannotConnect.value == true) return;
  currentAddress.value = serverAddressInput.value;
  isConnected.value = false;
  UDN.connect(serverAddressInput.value);
}

export function disconnect(): void {
  if (cannotDisonnect.value == true) return;
  UDN.disconnect();
}

export function resetAddressInput(): void {
  this.serverAddressInput.value = this.serverAddress.value;
}

// listeners
UDN.onconnect = () => {
  isConnected.value = true;
};

UDN.onmessage = (data) => {
  chats.value.forEach((chat) => {
    chat.onmessage(data);
  });
};

UDN.ondisconnect = () => {
  isConnected.value = false;
};

// MAILBOX
export const mailboxId = React.restoreState("mailbox-id", "");
export const isMailboxActive = new React.State(false);

export const cannotDeleteMailbox = React.createProxyState(
  [mailboxId, isMailboxActive],
  () => mailboxId.value == "" || isMailboxActive.value == false
);
export const cannotRequestMailbox = React.createProxyState(
  [isConnected, isMailboxActive],
  () => isConnected.value == false || isMailboxActive.value == true
);

export function requestMailbox(): void {
  if (cannotRequestMailbox.value == true) return;
  UDN.requestMailbox();
}

export function deleteMailbox(): void {
  if (cannotDeleteMailbox.value == true) return;
  UDN.deleteMailbox(mailboxId.value);
}

UDN.onmailboxcreate = (id) => {
  mailboxId.value = id;
  UDN.connectMailbox(id);
}

UDN.onmailboxconnect = () => {
  isMailboxActive.value = true;
}

UDN.onmailboxdelete = () => {
  isMailboxActive.value = false;
  mailboxId.value = "";
}

// MISC
export const isEncryptionUnavailable = window.crypto.subtle == undefined;
export const senderName = React.restoreState("sender-name", "");

export const selectedChat = new React.State<Chat | undefined>(undefined);

// INIT
if (serverAddressInput.value != "") {
  connect();
}
