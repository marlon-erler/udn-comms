// this file is responsible for managing individual chat messages.

import * as React from "bloatless-react";

import { ChatMessage, ChatModel } from "./chatModel";

export default class ChatMessageViewModel {
  chatModel: ChatModel;

  // data
  channel: string;
  sender: string;
  dateSent: string;
  body: React.State<string> = new React.State("");
  sentByUser: boolean;

  constructor(
    chatModel: ChatModel,
    chatMessage: ChatMessage,
    sentByUser: boolean
  ) {
    this.chatModel = chatModel;

    this.channel = chatMessage.channel;
    this.sender = chatMessage.sender;
    this.dateSent = new Date(chatMessage.dateSent).toLocaleString();
    this.body.value = chatMessage.body;
    this.sentByUser = sentByUser;
  }
}
