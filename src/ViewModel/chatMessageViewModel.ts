// this file is responsible for managing individual chat messages.

import * as React from "bloatless-react";

import { ChatMessage, ChatMessageStatus } from "../Model/Chat/chatModel";

import ChatViewModel from "./chatViewModel";

export default class ChatMessageViewModel {
  chatViewModel: ChatViewModel;

  // data
  chatMessage: ChatMessage;
  channel: string;
  sender: string;
  dateSent: string;
  body: React.State<string> = new React.State("");
  status: React.State<ChatMessageStatus | any> = new React.State<
    ChatMessageStatus | undefined
  >(undefined);
  sentByUser: boolean;

  // methods
  copyMessage = (): void => {
    navigator.clipboard.writeText(this.body.value);
  };
  resendMessage = (): void => {
    this.chatViewModel.sendMessageFromBody(this.body.value);
  };
  decryptMessage = (): void => {
    this.chatViewModel.decryptMessage(this);
  };

  // load
  loadData = (): void => {
    this.channel = this.chatMessage.channel;
    this.sender = this.chatMessage.sender;
    this.dateSent = new Date(this.chatMessage.dateSent).toLocaleString();
    this.body.value = this.chatMessage.body;
    this.status.value = this.chatMessage.status;
  };

  // init
  constructor(
    chatViewModel: ChatViewModel,
    chatMessage: ChatMessage,
    sentByUser: boolean
  ) {
    this.chatViewModel = chatViewModel;

    this.chatMessage = chatMessage;
    this.sentByUser = sentByUser;
    this.loadData();
  }
}
