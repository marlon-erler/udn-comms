// this file is responsible for managing chats and chat messages. objects are delegated to objectModel.ts.

import { createTimestamp } from "../utility";

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
  