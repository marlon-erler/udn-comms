import * as React from "bloatless-react";

import { Chat, createChatWithName } from "./chatModel";

import UDNFrontend from "udn-frontend";
import { translation } from "../translations";

export const UDN = new UDNFrontend();

// CONNECTION
export const isConnected = new React.State(false);

export const serverAddressInput = React.restoreState("socket-address", "");
export const didRequestConnection = React.restoreState(
  "did-request-connection",
  false
);
export const currentAddress = React.restoreState("current-address", "");
export const previousAddresses =
  React.restoreListState<string>("previous-addresses");

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

export const cannotResetAddress = React.createProxyState(
  [serverAddressInput, currentAddress],
  () => serverAddressInput.value == currentAddress.value
);

// methods
export function connect(): void {
  if (cannotConnect.value == true) return;

  serverAddressInput.value = serverAddressInput.value.toLowerCase();
  currentAddress.value = serverAddressInput.value;

  isConnected.value = false;
  didRequestConnection.value = true;

  UDN.connect(serverAddressInput.value);

  isMailboxActive.value = false;
}

export function disconnect(): void {
  didRequestConnection.value = false;
  if (cannotDisonnect.value == true) return;
  UDN.disconnect();
}

export function resetAddressInput(): void {
  serverAddressInput.value = currentAddress.value;
}

export function subscribeChannels() {
  chats.value.forEach((chat) => {
    UDN.subscribe(chat.primaryChannel.value);
  });
}

// listeners
UDN.onconnect = () => {
  isConnected.value = true;
  const lowerCasedAddress = currentAddress.value.toLowerCase();
  if (!previousAddresses.value.has(lowerCasedAddress)) {
    previousAddresses.add(lowerCasedAddress);
  }

  subscribeChannels();
  if (mailboxId.value != "") UDN.connectMailbox(mailboxId.value);
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
  [mailboxId, isMailboxActive, isConnected],
  () =>
    mailboxId.value == "" ||
    isMailboxActive.value == false ||
    isConnected.value == false
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

export function updateMailbox(): void {
  if (isMailboxActive.value == false) return;
  deleteMailbox();
  setTimeout(() => requestMailbox(), 10);
}

UDN.onmailboxcreate = (id) => {
  mailboxId.value = id;
  UDN.connectMailbox(id);
};

UDN.onmailboxconnect = (id) => {
  isMailboxActive.value = true;
};

UDN.onmailboxdelete = () => {
  isMailboxActive.value = false;
  mailboxId.value = "";
  subscribeChannels();
};

// OUTBOX
export const outboxItemCount = new React.State(0);
export const outboxText = React.createProxyState([outboxItemCount], () =>
  translation.outboxText(outboxItemCount.value)
);
export const outboxTextStyle = React.createProxyState([outboxItemCount], () =>
  outboxItemCount.value == 0 ? "success" : "warning"
);

// MISC
export const isPresentingSettingsModal = new React.State(false);
export const isEncryptionAvailable = window.crypto.subtle != undefined;
export const senderName = React.restoreState("sender-name", "");
export const pageZoom = React.restoreState("page-zoom", 100);
pageZoom.subscribe(() => {
  document.body.style.zoom = `${pageZoom.value}%`;
  document.body.style.webkitTextSizeAdjust = `${pageZoom.value}%`;
});

export function toggleSettings() {
  isPresentingSettingsModal.value = !isPresentingSettingsModal.value;
}

export function repairApp() {
  mapSetToLowercase(previousAddresses);
  removeSetDuplicates(previousAddresses);
  removeSetDuplicates(usedObjectCategories);
  removeSetDuplicates(usedObjectStatuses);
}

function mapSetToLowercase(listState: React.ListState<string>) {
  const lowerCased = [...listState.value].map((x) => x.toLowerCase());
  listState.clear();
  listState.add(...lowerCased);
}

function removeSetDuplicates(listState: React.ListState<any>) {
  const values = [...listState.value];
  listState.clear();
  listState.add(...values);
}

export function clearAddresses() {
  previousAddresses.clear();
}

export function clearCategories() {
  usedObjectCategories.clear();
}

export function clearStatuses() {
  usedObjectStatuses.clear();
}

const zoomStep = 10;
export function zoomOut() {
  pageZoom.value -= zoomStep;
}
export function zoomIn() {
  pageZoom.value += zoomStep;
}

export const usedObjectCategories =
  React.restoreListState<string>("object-categories");
export const usedObjectStatuses =
  React.restoreListState<string>("object-statuses");

// CHAT
export const chats = new React.ListState<Chat>();
export const chatIds = React.restoreListState<string>("chat-ids");

export const selectedChat = new React.State<Chat | undefined>(undefined);
export const isShowingObjects = React.restoreState("showing-objects", false);
export const newChatName = new React.State("");

export const cannotCreateChat = React.createProxyState(
  [newChatName],
  () => newChatName.value == ""
);

export function createChat() {
  if (cannotCreateChat.value == true) return;

  createChatWithName(newChatName.value);
  newChatName.value = "";
}

export function closeChatView() {
  selectedChat.value = undefined;
  document.getElementById("settings-tab")?.scrollIntoView();
}

export function selectChat(chat: Chat) {
  selectedChat.value = chat;
  chat.hasUnreadMessages.value = false;
  document.getElementById("message-tab")?.scrollIntoView();
}

export function toggleChatTools() {
  isShowingObjects.value = !isShowingObjects.value;
}

chatIds.value.forEach((id) => chats.add(new Chat(id)));

// INIT
if (serverAddressInput.value != "" && didRequestConnection.value == true) {
  connect();
}
