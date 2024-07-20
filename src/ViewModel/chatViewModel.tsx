import * as React from "bloatless-react";

import StorageModel, { storageKeys } from "../Model/storageModel";

import ChatListViewModel from "./chatListViewModel";
import { ChatModel } from "../Model/chatModel";

export default class ChatViewModel {
  chatModel: ChatModel;
  chatListViewModel: ChatListViewModel;
  storageModel: StorageModel;

  // state
  primaryChannel: React.State<string> = new React.State("");
  primaryChannelInput: React.State<string> = new React.State("");

  selectedPage: React.State<ChatPageType> = new React.State<ChatPageType>(
    ChatPageType.Messages
  );

  // guards
  cannotSetPrimaryChannel: React.State<boolean> = React.createProxyState(
    [this.primaryChannel, this.primaryChannelInput],
    () =>
      this.primaryChannelInput.value == "" ||
      this.primaryChannelInput.value == this.primaryChannel.value
  );

  // methods
  open = (): void => {
    this.chatListViewModel.openChat(this);
  };

  close = (): void => {
    this.chatListViewModel.closeChat();
  };

  // restore
  restorePageSelection = (): void => {
    const path: string[] = storageKeys.chatLastUsedPage(this.chatModel.id);
    const lastUsedPage: string | null = this.storageModel.restore(path);
    if (lastUsedPage != null) {
      this.selectedPage.value = lastUsedPage as any;
    }

    this.selectedPage.subscribeSilent((newPage) => {
      this.storageModel.store(path, newPage);
    });
  };

  // init
  constructor(chatListViewModel: ChatListViewModel, chatModel: ChatModel) {
    this.chatModel = chatModel;
    this.storageModel = chatModel.storageModel;
    this.chatListViewModel = chatListViewModel;

    this.primaryChannel.value = chatModel.info.primaryChannel;
    this.primaryChannelInput.value = chatModel.info.primaryChannel;

    this.restorePageSelection();
  }
}

// types
export enum ChatPageType {
  Settings = "settings",
  Messages = "messages",
  AllObjects = "all",
  Kanban = "kanban",
  Calendar = "calendar",
  Progress = "progress",
}
