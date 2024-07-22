// this file is responsible for managing individual chat messages.

import * as React from "bloatless-react";

import { ChatMessage, ChatMessageStatus } from "../../Model/Chat/chatModel";

import MessagePageViewModel from "../Pages/messagePageViewModel";

export default class ChatMessageViewModel {
  messagePageViewModel: MessagePageViewModel;

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
    this.messagePageViewModel.sendMessageFromBody(this.body.value);
  };
  decryptMessage = (): void => {
    this.messagePageViewModel.decryptMessage(this);
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
    messagePageViewModel: MessagePageViewModel,
    chatMessage: ChatMessage,
    sentByUser: boolean
  ) {
    this.messagePageViewModel = messagePageViewModel;

    this.chatMessage = chatMessage;
    this.sentByUser = sentByUser;
    this.loadData();
  }
}
