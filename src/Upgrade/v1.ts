import {
  ChatMessage,
  ChatObject,
  ChatObjectContent,
} from "../Model/chatModel";

import { v4 } from "uuid";

// ChatMessage
export interface ChatMessageV1 {
  channel: string;
  sender: string;
  body: string;
  isoDate: string;

  messageObjectString?: string;
}

export function upgradeMessageFromV1(
  chatMessageV1: ChatMessageV1
): ChatMessage {
  const { channel, sender, body, isoDate, messageObjectString } = chatMessageV1;
  return {
    dataVersion: "v2",

    id: v4(),

    channel,
    sender,
    body,
    dateSent: isoDate,
    stringifiedObject: messageObjectString,
  };
}

// MessageObject
export interface MessageObjectV1 {
  id: string;
  title: string;
  contentVersions: { [key: string]: MessageObjectContentV1 };
}

export function upgradeMessageObjectFromV1(
  messageObjectV1: MessageObjectV1
): ChatObject {
  const { id, title, contentVersions } = messageObjectV1;

  const upgradedContentVersions: { [key: string]: ChatObjectContent } = {};
  for (const entry of Object.entries(contentVersions)) {
    const [id, object] = entry;
    const upgraded = upgradeMessageObjectContentFromV1(object);
    upgradedContentVersions[id] = upgraded;
  }

  return {
    dataVersion: "v2",

    id,
    title,

    contentVersions: upgradedContentVersions,
  };
}

// MessageObjectContent
export interface MessageObjectContentV1 {
  isoDateVersionCreated: string;
  id: string;

  noteContent?: string;
  priority?: number;
  categoryName?: string;
  status?: string;
  date?: string;
  time?: string;
}

export function upgradeMessageObjectContentFromV1(
  messageObjectContentV1: MessageObjectContentV1
): ChatObjectContent {
  const {
    isoDateVersionCreated,
    id,
    noteContent,
    priority,
    categoryName,
    status,
    date,
    time,
  } = messageObjectContentV1;

  return {
    dataVersion: "v2",

    id,
    creationDate: isoDateVersionCreated,

    noteText: noteContent,
    priority,
    category: categoryName,
    status,
    date,
    time,
  };
}
