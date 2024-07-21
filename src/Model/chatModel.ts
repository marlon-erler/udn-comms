// this file is responsible for managing chats. objects are delegated to objectModel.ts.

import StorageModel, { storageKeys } from "./storageModel";
import { createTimestamp, parse } from "./Utility/utility";
import { decryptString, encryptString } from "./Utility/crypto";

import ChatListModel from "./chatListModel";
import { Color } from "../ViewModel/colors";
import ConnectionModel from "./connectionModel";
import { Message } from "udn-frontend";
import SettingsModel from "./settingsModel";
import { checkIsValidObject } from "./Utility/typeSafety";
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

  chatMessageHandler: (chatMessage: ChatMessage) => void = () => {};

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
    this.subscribe();
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

  addMessage = (chatMessage: ChatMessage): void => {
    const messagePath: string[] = this.getMessagePath(chatMessage.id);
    this.storageModel.storeStringifiable(messagePath, chatMessage);
    this.chatMessageHandler(chatMessage);
  };

  addObject = (chatObject: ChatObject): void => {
    const objectPath: string[] = this.getObjectPath(chatObject.id);
    this.storageModel.storeStringifiable(objectPath, chatObject);
  };

  // delete
  delete = () => {
    // untrack
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

  get messages(): ChatMessage[] {
    const messageIds: string[] = this.storageModel.list(this.messageDirPath);
    if (!Array.isArray(messageIds)) return [];

    const messages: ChatMessage[] = [];
    for (const messageId of messageIds) {
      const messagePath: string[] = this.getMessagePath(messageId);
      const message: any = this.storageModel.restoreStringifiable(messagePath);
      if (checkIsValidObject(message) == false) continue;

      messages.push(message);
    }

    const sorted = messages.sort((a, b) =>
      a.dateSent.localeCompare(b.dateSent)
    );
    return sorted;
  }

  get objects(): ChatObject[] {
    const objectIds: string[] = this.storageModel.list(this.objectDirPath);
    if (!Array.isArray(objectIds)) return [];

    const objects: ChatObject[] = [];
    for (const objectId of objectIds) {
      const objectPathComponents: string[] = this.getObjectPath(objectId);
      const object: any =
        this.storageModel.restoreStringifiable(objectPathComponents);
      if (checkIsValidObject(object) == false) continue;
      if (object.id != objectId) continue;

      objects.push(object);
    }
    return objects;
  }

  // messaging
  sendMessage = async (body: string): Promise<boolean> => {
    const senderName = this.settingsModel.username;
    if (senderName == "") return false;

    const allChannels = [this.info.primaryChannel];
    for (const secondaryChannel of this.info.secondaryChannels) {
      allChannels.push(secondaryChannel);
    }

    const combinedChannel: string = allChannels.join("/");
    if (this.info.encryptionKey != "") {
      body = await encryptString(body, this.info.encryptionKey);
    }

    const chatMessage: ChatMessage = ChatModel.createChatMessage(
      combinedChannel,
      senderName,
      body
    );

    this.connectionModel.sendMessageOrStore(chatMessage);
    return true;
  };

  handleMessage = async (body: string): Promise<void> => {
    const chatMessage: ChatMessage | null = ChatModel.parseMessage(body);
    if (chatMessage == null) return;

    await this.decryptMessage(chatMessage);
  };

  decryptMessage = async (chatMessage: ChatMessage): Promise<void> => {
    const decryptedBody: string = await decryptString(
      chatMessage.body,
      this.info.encryptionKey
    );
    chatMessage.body = decryptedBody;
    this.addMessage(chatMessage);
  };

  setMessageHandler = (handler: (chatMessage: ChatMessage) => void): void => {
    this.chatMessageHandler = handler;
  };

  subscribe = (): void => {
    this.connectionModel.addChannel(this.info.primaryChannel);
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
    this.subscribe();
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

  static parseMessage = (string: string): ChatMessage | null => {
    try {
      const parsed: any = parse(string);
      if (checkIsValidObject(parsed) == false) return null;
      return parsed;
    } catch {
      return null;
    }
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
