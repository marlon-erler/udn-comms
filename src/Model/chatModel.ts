import * as React from "bloatless-react";

import {
  UDN,
  chatIds,
  chats,
  isConnected,
  selectedChat,
  senderName,
  updateMailbox,
} from "../Model/model";
import { decryptString, encryptString } from "../cryptUtility";

import { Message } from "udn-frontend";
import { storageKeys } from "../utility";

// TYPES
// message
export interface ChatMessage {
  channel: string;
  sender: string;
  body: string;
  isoDate: string;

  messageObject?: MessageObject;
}

// object
export interface MessageObject {
  id: string;
  title: string;
}

// chat
export class Chat {
  id: string;

  isSubscribed = new React.State(false);
  primaryChannel = new React.State("");
  hasUnreadMessages: React.State<boolean>;
  secondaryChannels: React.ListState<string>;

  encryptionKey: React.State<string>;
  messages: React.ListState<ChatMessage>;
  objects: React.MapState<MessageObject>;
  outbox: React.ListState<ChatMessage>;
  objectOutbox: React.MapState<MessageObject>;
  isOutBoxEmpty: React.State<boolean>;

  composingMessage: React.State<string>;
  primaryChannelInput: React.State<string>;
  newSecondaryChannelName: React.State<string>;

  cannotSendMessage: React.State<boolean>;
  cannotResendMessage: React.State<boolean>;
  cannotAddSecondaryChannel: React.State<boolean>;
  cannotSetChannel: React.State<boolean>;
  cannotUndoChannel: React.State<boolean>;
  cannotClearMessages: React.State<boolean>;
  cannotClearObjects: React.State<boolean>;

  // init
  constructor(id: string = React.UUID()) {
    this.id = id;

    // channels
    this.primaryChannel = React.restoreState(
      storageKeys.primaryChannel(id),
      ""
    );
    this.secondaryChannels = React.restoreListState(
      storageKeys.secondaryChannels(id)
    );

    // messaging
    this.hasUnreadMessages = React.restoreState(
      storageKeys.hasUnread(id),
      false
    );
    this.encryptionKey = React.restoreState(storageKeys.encyptionKey(id), "");
    this.messages = React.restoreListState(storageKeys.messages(id));
    this.objects = React.restoreMapState(storageKeys.objects(id));
    this.outbox = React.restoreListState(storageKeys.outbox(id));
    this.objectOutbox = React.restoreMapState(storageKeys.itemOutbox(id));
    this.isOutBoxEmpty = React.createProxyState(
      [this.outbox],
      () => this.outbox.value.size == 0
    );

    // inputs
    this.composingMessage = React.restoreState(
      storageKeys.composingMessage(id),
      ""
    );
    this.newSecondaryChannelName = new React.State("");
    this.primaryChannelInput = new React.State(this.primaryChannel.value);

    // guards
    this.cannotSendMessage = React.createProxyState(
      [this.primaryChannel, this.composingMessage, senderName],
      () =>
        this.primaryChannel.value == "" ||
        this.composingMessage.value == "" ||
        senderName.value == ""
    );
    this.cannotResendMessage = React.createProxyState(
      [this.primaryChannel, senderName],
      () => this.primaryChannel.value == "" || senderName.value == ""
    );
    this.cannotAddSecondaryChannel = React.createProxyState(
      [this.newSecondaryChannelName],
      () => this.newSecondaryChannelName.value == ""
    );
    this.cannotSetChannel = React.createProxyState(
      [this.primaryChannelInput, this.primaryChannel],
      () =>
        this.primaryChannelInput.value == "" ||
        this.primaryChannelInput.value == this.primaryChannel.value
    );
    this.cannotUndoChannel = React.createProxyState(
      [this.primaryChannelInput, this.primaryChannel],
      () => this.primaryChannelInput.value == this.primaryChannel.value
    );
    this.cannotClearMessages = React.createProxyState(
      [this.messages],
      () => this.messages.value.size == 0
    );
    this.cannotClearObjects = React.createProxyState(
      [this.objects],
      () => this.objects.value.size == 0
    );
  }

  // general
  deleteSelf = () => {
    Object.values(storageKeys).forEach((storageKey) => {
      localStorage.removeItem(storageKey(this.id));
    });

    chats.remove(this);
    chatIds.remove(this.id);
  };

  // handlers
  onmessage = async (data: Message): Promise<void> => {
    if (!data.messageChannel) return;
    const channels = data.messageChannel.split("/");
    if (channels.indexOf(this.primaryChannel.value) == -1) return;

    if (data.subscribed != undefined) this.handleSubscription(data.subscribed);

    if (!data.messageBody) return;
    const { sender, body, channel, isoDate, messageObject } = JSON.parse(
      data.messageBody
    );

    if (messageObject && messageObject.id && messageObject.title) {
      return this.handleMessageObject(messageObject);
    }

    this.handleMessage({
      sender,
      body: await decryptString(body, this.encryptionKey.value),
      channel,
      isoDate,
    });
  };

  handleSubscription = (isSubscribed: boolean): void => {
    this.isSubscribed.value = isSubscribed;

    if (isSubscribed == true) {
      this.sendMessagesInOutbox();
    }
  };

  handleMessage = (chatMessage: ChatMessage): void => {
    this.messages.add(chatMessage);
    if (selectedChat.value != this) this.hasUnreadMessages.value = true;
  };

  handleMessageObject = (messageObject: MessageObject): void => {
    this.objects.set(messageObject.id, messageObject);
  };

  // messages
  createChatMessage = async (
    messageText: string,
    messageObject?: MessageObject
  ): Promise<ChatMessage> => {
    // get channels
    const secondaryChannelNames: string[] = [
      ...this.secondaryChannels.value.values(),
    ];
    const allChannelNames: string[] = [
      this.primaryChannel.value,
      ...secondaryChannelNames,
    ];

    // create object
    const joinedChannelName = allChannelNames.join("/");
    const chatMessage: ChatMessage = {
      channel: joinedChannelName,
      sender: senderName.value,
      body: messageText,
      isoDate: new Date().toISOString(),
    };

    if (messageObject) chatMessage.messageObject = messageObject;
    return chatMessage;
  };

  sendMessageFromComposer = async (): Promise<void> => {
    if (this.cannotSendMessage.value == true) return;

    await this.sendMessageFromText(this.composingMessage.value);
    this.composingMessage.value = "";
  };

  sendMessageFromText = async (text: string): Promise<void> => {
    const chatMessage = await this.createChatMessage(text);
    this.outbox.add(chatMessage);
    this.sendMessagesInOutbox();
  };

  resendMessage = (chatMessage: ChatMessage) => {
    if (this.cannotResendMessage.value == true) return;
    this.sendMessageFromText(chatMessage.body);
  };

  sendMessagesInOutbox = () => {
    this.outbox.value.forEach((message) => {
      this.sendMessage(message);
    });
    this.objectOutbox.value.forEach(async (object) => {
      const chatMessage = await this.createChatMessage("", object);
      this.sendMessage(chatMessage);
    });
  };

  clearMessages = (): void => {
    this.messages.clear();
  };

  deleteMessage = (chatMessage: ChatMessage): void => {
    this.messages.remove(chatMessage);
  };

  deleteOutboxMessage = (chatMessage: ChatMessage): void => {
    this.outbox.remove(chatMessage);
  };

  decryptReceivedMessage = async (chatMessage: ChatMessage): Promise<void> => {
    chatMessage.body = await decryptString(
      chatMessage.body,
      this.encryptionKey.value
    );
    this.messages.callSubscriptions();
  };

  sendMessage = async (chatMessage: ChatMessage): Promise<void> => {
    if (isConnected.value == false || this.isSubscribed.value == false) return;

    const encryptedBody =
      this.encryptionKey.value == ""
        ? chatMessage.body
        : await encryptString(chatMessage.body, this.encryptionKey.value);

    chatMessage.body = encryptedBody;

    const messageString = JSON.stringify(chatMessage);
    UDN.sendMessage(chatMessage.channel, messageString);

    this.outbox.remove(chatMessage);
    if (chatMessage.messageObject)
      this.objectOutbox.remove(chatMessage.messageObject.id);
  };

  // objects
  addObjectAndSend = (object: MessageObject): void => {
    this.objects.set(object.id, object);
    this.sendObject(object);
  };

  sendObject = (object: MessageObject): void => {
    this.objectOutbox.set(object.id, object);
    this.sendMessagesInOutbox();
  };

  deleteObject = (object: MessageObject): void => {
    this.objects.remove(object.id);
    this.objectOutbox.remove(object.id);
  };

  resendObjects = (): void => {
    this.objects.value.forEach((object) => {
      this.sendObject(object);
    });
  };

  clearObjects = (): void => {
    this.objects.clear();
  };

  // channel
  setChannel = (): void => {
    if (this.cannotSetChannel.value == true) return;
    this.primaryChannel.value = this.primaryChannelInput.value;
    UDN.subscribe(this.primaryChannel.value);
    updateMailbox();
  };

  undoChannelChange = (): void => {
    this.primaryChannelInput.value = this.primaryChannel.value;
  };

  addSecondaryChannel = (): void => {
    if (this.cannotAddSecondaryChannel.value == true) return;

    this.secondaryChannels.add(this.newSecondaryChannelName.value);
    this.newSecondaryChannelName.value = "";
  };

  removeSecondaryChannel = (channel: string): void => {
    this.secondaryChannels.remove(channel);
  };
}

// METHODS
export function createChatWithName(name: string): void {
  const newChat = new Chat();
  chats.add(newChat);

  newChat.primaryChannel.value = name;
  newChat.primaryChannelInput.value = name;
  chatIds.add(newChat.id);

  UDN.subscribe(name);
  updateMailbox();
}
