// this file is responsible for managing chats and chat messages. objects are delegated to objectModel.ts.

import StorageModel, { storageKeys } from "./storageModel";

import { createTimestamp } from "../utility";

export class ChatModel {
    info: ChatInfo;

    messages: ChatMessage[];
    objects: ChatObject[];
    outbox: ChatMessage[];

    constructor(storageModel: StorageModel, chatId: string) {
      const infoPath = storageKeys.chatInfo(chatId)
      const info = storageModel.restoreStringifiable(infoPath);
    }
}

// creation methods
export function createChatMessage(channel: string, sender: string, body: string): ChatMessage {
    return {
        dataVersion: "v2",

        channel,
        sender,
        body,
        dateSent: createTimestamp(),
    }
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
    
    contentVersions: { [key: string]: MessageObjectContent };
  }
  
  export interface MessageObjectContent {
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
  