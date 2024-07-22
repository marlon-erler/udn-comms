import * as React from "bloatless-react";

import ChatListModel from "../Model/Chat/chatListModel";
import ChatModel from "../Model/chatModel";
import ChatViewModel from "./chatViewModel";
import SettingsViewModel from "./settingsViewModel";
import StorageModel from "../Model/Global/storageModel";

export default class ChatListViewModel {
  chatListModel: ChatListModel;
  storageModel: StorageModel;
  settingsViewModel: SettingsViewModel;

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

  // methods
  createChat = (): void => {
    const chatModel: ChatModel = this.chatListModel.createChat(
      this.newChatPrimaryChannel.value
    );
    this.newChatPrimaryChannel.value = "";

    const chatViewModel: ChatViewModel = this.createChatViewModel(chatModel);
    this.chatViewModels.add(chatViewModel);

    this.updateIndices();
  };

  untrackChat = (chatViewModel: ChatViewModel): void => {
    this.chatListModel.untrackChat(chatViewModel.chatModel);
    this.chatViewModels.remove(chatViewModel);
  };

  createChatViewModel = (chatModel: ChatModel): ChatViewModel => {
    return new ChatViewModel(
      chatModel,
      this.storageModel,
      this.settingsViewModel,
      this
    );
  };

  // view
  openChat = (chatViewModel: ChatViewModel): void => {
    this.selectedChat.value = chatViewModel;
  };

  closeChat = (): void => {
    this.selectedChat.value = undefined;
  };

  // sorting
  updateIndices = (): void => {
    for (const chatViewModel of this.chatViewModels.value) {
      chatViewModel.updateIndex();
    }
  };

  // load
  loadChats = (): void => {
    this.chatViewModels.clear();
    for (const chatModel of this.chatListModel.chatModels.values()) {
      const chatViewModel = this.createChatViewModel(chatModel);
      this.chatViewModels.add(chatViewModel);
    }
  };

  // init
  constructor(
    chatListModel: ChatListModel,
    storageModel: StorageModel,
    settingsViewModel: SettingsViewModel
  ) {
    this.chatListModel = chatListModel;
    this.storageModel = storageModel;
    this.settingsViewModel = settingsViewModel;

    this.loadChats();
  }
}
