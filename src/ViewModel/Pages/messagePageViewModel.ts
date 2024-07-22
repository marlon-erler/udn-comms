import * as React from "bloatless-react";

import { ChatMessage } from "../../Model/Chat/chatModel";
import ChatMessageViewModel from "../Chat/chatMessageViewModel";
import ChatViewModel from "../Chat/chatViewModel";

export default class MessagePageViewModel {
  chatViewModel: ChatViewModel;

  // state
  chatMessageViewModels: React.MapState<ChatMessageViewModel> =
    new React.MapState();
  composingMessage: React.State<string> = new React.State("");

  // guards
  cannotSendMessage: React.State<boolean>;

  // methods
  addChatMessage = (chatMessage: ChatMessage): void => {
    const chatMessageModel = new ChatMessageViewModel(
      this,
      chatMessage,
      chatMessage.sender == this.chatViewModel.settingsViewModel.username.value
    );

    const existingChatMessageViewModel: ChatMessageViewModel | undefined =
      this.chatMessageViewModels.value.get(chatMessage.id);
    if (existingChatMessageViewModel != undefined) {
      existingChatMessageViewModel.body.value = chatMessage.body;
      existingChatMessageViewModel.status.value = chatMessage.status;
    } else {
      this.chatMessageViewModels.set(chatMessage.id, chatMessageModel);
    }
  };

  sendMessage = (): void => {
    if (this.cannotSendMessage.value == true) return;

    this.sendMessageFromBody(this.composingMessage.value);
    this.composingMessage.value = "";
  };

  sendMessageFromBody = (body: string): void => {
    this.chatViewModel.chatModel.sendMessage(body);
  };

  decryptMessage = async (
    messageViewModel: ChatMessageViewModel
  ): Promise<void> => {
    const chatMessage: ChatMessage = messageViewModel.chatMessage;
    await this.chatViewModel.chatModel.decryptMessage(chatMessage);
    this.chatViewModel.chatModel.addMessage(chatMessage);
    messageViewModel.loadData();
  };

  // load
  loadData = (): void => {
    this.cannotSendMessage = React.createProxyState(
      [this.chatViewModel.settingsViewModel.username, this.composingMessage],
      () =>
        this.chatViewModel.settingsViewModel.username.value == "" ||
        this.composingMessage.value == ""
    );
  };

  loadMessages = (): void => {
    for (const chatMessage of this.chatViewModel.chatModel.messages) {
      this.addChatMessage(chatMessage);
    }
  };

  // init
  constructor(chatViewModel: ChatViewModel) {
    this.chatViewModel = chatViewModel;
    this.loadData();
  }
}
