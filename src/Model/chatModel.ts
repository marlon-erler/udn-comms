// this file is responsible for managing chats and chat messages. objects are delegated to objectModel.ts.

import StorageModel, { storageKeys } from "./storageModel";

import ChatListModel from "./chatListModel";
import { Color } from "../ViewModel/colors";
import ConnectionModel from "./connectionModel";
import SettingsModel from "./settingsModel";
import { checkIsValidObject } from "./Utility/typeSafety";
import { createTimestamp } from "./Utility/utility";
import { v4 } from "uuid";

export class ChatModel {
  connectionModel: ConnectionModel;
  storageModel: StorageModel;
  settingsModel: SettingsModel;
  chatListModel: ChatListModel;

  // data
  id: string;
  info: ChatInfo;
  color: Color;

  messages = new Set<ChatMessage>();
  objects = new Map<string, ChatObject>();

  // sorting
  get index(): number {
    return this.chatListModel.getIndexOfPrimaryChannel(
      this.info.primaryChannel
    );
  }

  // paths
  get infoPath(): string[] {
    return storageKeys.chatInfo(this.id);
  }

  get colorPath(): string[] {
    return storageKeys.chatColor(this.id);
  }

  get messageDirPath(): string[] {
    return storageKeys.chatMessages(this.id);
  }

  get objectDirPath(): string[] {
    return storageKeys.chatObjects(this.id);
  }

  getMessagePath = (id: string): string[] => {
    return [...this.messageDirPath, id];
  };

  getObjectPath = (id: string): string[] => {
    return [...this.objectDirPath, id];
  };

  // set
  setPrimaryChannel = (primaryChannel: string): void => {
    this.info.primaryChannel = primaryChannel;
    this.storeInfo();
    this.chatListModel.updateIndices();
  };

  setSecondaryChannels = (secondaryChannels: string[]): void => {
    this.info.secondaryChannels = secondaryChannels;
    this.storeInfo();
  };

  setEncryptionKey = (key: string): void => {
    this.info.encryptionKey = key;
    this.storeInfo();
  };

  setColor = (color: Color): void => {
    this.color = color;
    this.storeColor();
  };

  // store & add
  storeInfo = (): void => {
    this.storageModel.storeStringifiable(this.infoPath, this.info);
  };

  storeColor = (): void => {
    this.storageModel.store(this.colorPath, this.color);
  };

  addMessage = (message: ChatMessage): void => {
    if (!this.messages.has(message)) {
      this.messages.add(message);
    }
    const messagePath: string[] = this.getMessagePath(message.id);
    this.storageModel.storeStringifiable(messagePath, message);
  };

  addObject = (object: ChatObject): void => {
    this.objects.set(object.id, object);
    const objectPath: string[] = this.getObjectPath(object.id);
    this.storageModel.storeStringifiable(objectPath, object);
  };

  // delete
  delete = () => {
    // untrack
    this.unloadData();
    this.chatListModel.untrackChat(this);

    // delete
    const dirPath: string[] = [...storageKeys.chats, this.id];
    this.storageModel.removeRecursive(dirPath);
  };

  // restore
  restoreInfo = (): void => {
    const info: any = this.storageModel.restoreStringifiable(this.infoPath);
    if (info != null) {
      this.info = info;
    } else {
      this.info = ChatModel.generateChatInfo("0");
    }
  };

  restoreColor = (): void => {
    const path: string[] = this.colorPath;
    const color: string | null = this.storageModel.restore(path);
    if (!color) {
      this.color = Color.Standard;
    } else {
      this.color = color as any;
    }
  };

  restoreMessages = (): void => {
    const messageIds: string[] = this.storageModel.list(this.messageDirPath);
    if (!Array.isArray(messageIds)) return;

    for (const messageId of messageIds) {
      const messagePath: string[] = this.getMessagePath(messageId);
      const message: any = this.storageModel.restoreStringifiable(messagePath);
      if (checkIsValidObject(message) == false) return;

      this.messages.add(message);
    }
  };

  restoreObjects = (): void => {
    const objectIds: string[] = this.storageModel.list(this.objectDirPath);
    if (!Array.isArray(objectIds)) return;

    for (const objectId of objectIds) {
      const objectPathComponents: string[] = this.getObjectPath(objectId);
      const object: any =
        this.storageModel.restoreStringifiable(objectPathComponents);
      if (checkIsValidObject(object) == false) return;
      if (object.id != objectId) return;

      this.objects.set(objectId, object);
    }
  };

  // messaging
  sendMessage = (body: string): void => {
    const allChannels = [this.info.primaryChannel];
    for (const secondaryChannel of this.info.secondaryChannels) {
      allChannels.push(secondaryChannel);
    }

    const combinedChannel = allChannels.join("/");

    const chatMessage: ChatMessage = ChatModel.createChatMessage(
      combinedChannel,
      this.settingsModel.username,
      body
    );
    
    this.connectionModel.sendMessageOrStore(chatMessage);
  };

  // memory
  loadData = (): void => {
    this.restoreMessages();
    this.restoreObjects();
  };

  unloadData = (): void => {
    this.messages.clear();
    this.objects.clear();
  };

  // init
  constructor(
    storageModel: StorageModel,
    connectionModel: ConnectionModel,
    settingsModel: SettingsModel,
    chatListModel: ChatListModel,
    chatId: string
  ) {
    this.id = chatId;
    this.connectionModel = connectionModel;
    this.settingsModel = settingsModel;
    this.storageModel = storageModel;
    this.chatListModel = chatListModel;

    this.restoreInfo();
    this.restoreColor();
  }

  // utility
  static generateChatInfo = (primaryChannel: string): ChatInfo => {
    return {
      primaryChannel,
      secondaryChannels: [],
      encryptionKey: "",
      hasUnreadMessages: false,
    };
  };

  static createChatMessage = (
    channel: string,
    sender: string,
    body: string
  ): ChatMessage => {
    return {
      dataVersion: "v2",

      id: v4(),

      channel,
      sender,
      body,
      dateSent: createTimestamp(),
    };
  };
}

// types
export interface ChatInfo {
  primaryChannel: string;
  secondaryChannels: string[];
  encryptionKey: string;

  hasUnreadMessages: boolean;
}

export interface ChatMessage {
  dataVersion: "v2";

  id: string;

  channel: string;
  sender: string;
  body: string;
  dateSent: string;

  stringifiedObject?: string;
}

export interface ChatObject {
  dataVersion: "v2";

  id: string;
  title: string;

  contentVersions: { [key: string]: ChatObjectContent };
}

export interface ChatObjectContent {
  dataVersion: "v2";

  id: string;
  creationDate: string;

  noteText?: string;
  priority?: number;
  category?: string;
  status?: string;
  date?: string;
  time?: string;
}
