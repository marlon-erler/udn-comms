// this file is responsible for managing chats and chat messages. objects are delegated to objectModel.ts.

import StorageModel, { storageKeys } from "./storageModel";

import { checkIsValidObject } from "./Utility/typeSafety";
import { createTimestamp } from "./Utility/utility";
import { v4 } from "uuid";

export class ChatModel {
  // data
  id: string;
  storageModel: StorageModel;
  info: ChatInfo;

  messages = new Set<ChatMessage>();
  objects = new Map<string, ChatObject>();
  outbox = new Set<ChatMessage>();

  // paths
  get infoPath(): string {
    return storageKeys.chatInfo(this.id);
  }

  get messageDirPath(): string {
    return storageKeys.chatMessages(this.id);
  }

  get objectDirPath(): string {
    return storageKeys.chatObjects(this.id);
  }

  get outboxDirPath(): string {
    return storageKeys.chatOutbox(this.id);
  }

  getMessagePath(id: string): string {
    return StorageModel.join(this.messageDirPath, id);
  }

  getObjectPath(id: string): string {
    return StorageModel.join(this.objectDirPath, id);
  }

  // set
  setPrimaryChannel(primaryChannel: string): void {
    this.info.primaryChannel = primaryChannel;
    this.storeInfo();
  }

  setSecondaryChannels(secondaryChannels: string[]): void {
    this.info.secondaryChannels = secondaryChannels;
    this.storeInfo();
  }

  // store & add
  storeInfo(): void {
    this.storageModel.storeStringifiable(this.infoPath, this.info);
  }

  addMessage(message: ChatMessage): void {
    if (!this.messages.has(message)) {
      this.messages.add(message);
    }
    const messagePath: string = this.getMessagePath(message.id);
    this.storageModel.storeStringifiable(messagePath, message);
  }

  addObject(object: ChatObject): void {
    this.objects.set(object.id, object);
    const objectPath: string = this.getObjectPath(object.id);
    this.storageModel.storeStringifiable(objectPath, object);
  }

  // restore
  restoreInfo(): void {
    const info: any = this.storageModel.restoreStringifiable(this.infoPath);
    this.info == info ?? generateChatInfo("0");
  }

  restoreMessages(): void {
    const messageIds: string[] = this.storageModel.list(this.messageDirPath);
    if (!Array.isArray(messageIds)) return;

    for (const messageId of messageIds) {
      const messagePath: string = this.getMessagePath(messageId);
      const message: any = this.storageModel.restoreStringifiable(messagePath);
      if (checkIsValidObject(message) == false) return;

      this.messages.add(message);
    }
  }

  restoreObjects(): void {
    const objectIds: string[] = this.storageModel.list(this.objectDirPath);
    if (!Array.isArray(objectIds)) return;

    for (const objectId of objectIds) {
      const objectPath: string = this.getObjectPath(objectId);
      const object: any = this.storageModel.restoreStringifiable(objectPath);
      if (checkIsValidObject(object) == false) return;
      if (object.id != objectId) return;

      this.objects.set(objectId, object);
    }
  }

  // init
  constructor(storageModel: StorageModel, chatId: string) {
    this.id = chatId;
    this.storageModel = storageModel;

    this.restoreInfo();
    this.restoreMessages();
    this.restoreObjects();
  }
}

// creation methods
export function createChat(storageModel: StorageModel, primaryChannel: string): ChatModel {
  const id: string = v4();

  const chatModel = new ChatModel(storageModel, id);
  chatModel.setPrimaryChannel(primaryChannel);
  
  return chatModel;
}

export function generateChatInfo(primaryChannel: string): ChatInfo {
  return {
    primaryChannel,
    secondaryChannels: [],
    encryptionKey: "",
    hasUnreadMessages: false,
  };
}

export function createChatMessage(
  channel: string,
  sender: string,
  body: string
): ChatMessage {
  return {
    dataVersion: "v2",

    id: v4(),

    channel,
    sender,
    body,
    dateSent: createTimestamp(),
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
