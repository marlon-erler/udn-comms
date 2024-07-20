import * as React from "bloatless-react";

import ChatListViewModel from "./chatListViewModel";
import { ChatModel } from "../Model/chatModel";
import StorageModel from "../Model/storageModel";

export default class ChatViewModel {
  chatModel: ChatModel;
  chatListViewModel: ChatListViewModel;

  // state
  primaryChannel: React.State<string> = new React.State("");
  primaryChannelInput: React.State<string> = new React.State("");

  // guards
  cannotSetPrimaryChannel: React.State<boolean> = React.createProxyState(
    [this.primaryChannel, this.primaryChannelInput],
    () =>
      this.primaryChannelInput.value == "" ||
      this.primaryChannelInput.value == this.primaryChannel.value
  );

  // methods
  open = () => {
    this.chatListViewModel.openChat(this);
  }

  close = () => {
    this.chatListViewModel.closeChat();
  }

  // init
  constructor(chatListViewModel: ChatListViewModel, chatModel: ChatModel) {
    this.chatModel = chatModel;
    this.chatListViewModel = chatListViewModel;

    this.primaryChannel.value = chatModel.info.primaryChannel;
    this.primaryChannelInput.value = chatModel.info.primaryChannel;
  }
}
