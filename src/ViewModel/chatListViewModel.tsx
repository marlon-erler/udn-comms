import * as React from "bloatless-react";

import ChatListModel from "../Model/chatListModel";
import { ChatModel } from "../Model/chatModel";
import ChatViewModel from "./chatViewModel";
import StorageModel from "../Model/storageModel";

export default class ChatListViewModel {
  storageModel: StorageModel;
  chatListModel: ChatListModel;

  // state
  newChatPrimaryChannel: React.State<string> = new React.State("");
  chatViewModels: React.ListState<ChatViewModel> = new React.ListState();

  selectedChat: React.State<ChatViewModel | undefined> = new React.State<
    ChatViewModel | undefined
  >(undefined);

  // guards
  cannotCreateChat = React.createProxyState(
    [this.newChatPrimaryChannel],
    () => this.newChatPrimaryChannel.value == ""
  );

  // sorting
  get sortedPrimaryChannels(): string[] {
    return this.chatListModel.sortedPrimaryChannels;
  }

  getIndexOfChat(chat: ChatViewModel): number {
    return this.sortedPrimaryChannels.indexOf(chat.primaryChannel.value);
  }

  updateIndices = (): void => {
    for (const chatViewModel of this.chatViewModels.value) {
      chatViewModel.updateIndex();
    }
  }

  // methods
  createChat = (): void => {
    const chatModel: ChatModel = this.chatListModel.createChat(
      this.newChatPrimaryChannel.value
    );
    this.newChatPrimaryChannel.value = "";

    const chatViewModel: ChatViewModel = new ChatViewModel(this, chatModel);
    this.chatViewModels.add(chatViewModel);
  };

  untrackChat = (chatViewModel: ChatViewModel): void => {
    this.chatListModel.untrackChat(chatViewModel.chatModel);
    this.chatViewModels.remove(chatViewModel);
  };

  openChat = (chatViewModel: ChatViewModel): void => {
    this.selectedChat.value = chatViewModel;
  };

  closeChat = (): void => {
    this.selectedChat.value = undefined;
  };

  // restore
  restoreChats = (): void => {
    for (const chatModel of this.chatListModel.chatModels.values()) {
      const chatViewModel = new ChatViewModel(this, chatModel);
      this.chatViewModels.add(chatViewModel);
    }
  };

  // init
  constructor(storageModel: StorageModel) {
    this.storageModel = storageModel;

    const chatListModel = new ChatListModel(storageModel);
    this.chatListModel = chatListModel;

    this.restoreChats();
  }
}
