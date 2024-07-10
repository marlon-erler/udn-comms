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

  itemData?: Item;
}

// item
export interface Item {
  id: string;
  title: string;
}

export interface NoteItem extends Item {
  body: string;
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
  items: React.MapState<Item>;
  outbox: React.ListState<ChatMessage>;
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
    this.items = React.restoreMapState(storageKeys.items(id));
    this.outbox = React.restoreListState(storageKeys.outbox(id));
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
    const { sender, body, channel, isoDate, itemData } = JSON.parse(
      data.messageBody
    );

    if (itemData != undefined) {
      return this.handleItem(itemData);
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

  handleItem = (itemData: Item): void => {
    console.log(itemData);
  };

  // messages
  createMessage = async (
    messageText: string,
    itemData?: Item
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
    const messageObject: ChatMessage = {
      channel: joinedChannelName,
      sender: senderName.value,
      body: messageText,
      isoDate: new Date().toISOString(),
    };

    if (itemData) messageObject.itemData = itemData;
    return messageObject;
  };

  sendMessageFromComposer = async (): Promise<void> => {
    if (this.cannotSendMessage.value == true) return;

    await this.sendMessageFromText(this.composingMessage.value);
    this.composingMessage.value = "";
  };

  sendMessageFromText = async (text: string): Promise<void> => {
    const message = await this.createMessage(text);
    this.sendMessage(message);
  };

  resendMessage = (message: ChatMessage) => {
    if (this.cannotResendMessage.value == true) return;
    this.sendMessageFromText(message.body);
  };

  sendMessage = async (chatMessage: ChatMessage): Promise<void> => {
    if (isConnected.value == true && this.isSubscribed.value == true) {
      const encrypted =
        this.encryptionKey.value == ""
          ? chatMessage.body
          : await encryptString(chatMessage.body, this.encryptionKey.value);

      chatMessage.body = encrypted;

      const messageString = JSON.stringify(chatMessage);
      UDN.sendMessage(chatMessage.channel, messageString);
    } else {
      this.outbox.add(chatMessage);
    }
  };

  sendMessagesInOutbox = () => {
    this.outbox.value.forEach((message) => {
      this.sendMessage(message);
      this.outbox.remove(message);
    });
  };

  clearMessages = (): void => {
    this.messages.clear();
  };

  deleteMessage = (message: ChatMessage): void => {
    this.messages.remove(message);
  };

  deleteOutboxMessage = (message: ChatMessage): void => {
    this.outbox.remove(message);
  };

  decryptReceivedMessage = async (message: ChatMessage): Promise<void> => {
    message.body = await decryptString(message.body, this.encryptionKey.value);
    this.messages.callSubscriptions();
  };

  // items
  async createItem(item: Item): Promise<void> {
    this.items.set(item.id, item);

    const message = await this.createMessage("", item);
    this.sendMessage(message);
  }

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
