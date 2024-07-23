import * as React from "bloatless-react";

import ChatListModel from "../../Model/Chat/chatListModel";
import ChatModel from "../../Model/Chat/chatModel";
import ChatViewModel from "./chatViewModel";
import { IndexManager } from "../../Model/Utility/utility";
import SettingsViewModel from "../Global/settingsViewModel";
import StorageModel from "../../Model/Global/storageModel";

export default class ChatListViewModel {
  chatListModel: ChatListModel;
  storageModel: StorageModel;
  settingsViewModel: SettingsViewModel;

  // state
  newChatPrimaryChannel: React.State<string> = new React.State("");
  chatViewModels: React.ListState<ChatViewModel> = new React.ListState();
  indexManager: IndexManager<ChatViewModel> = new IndexManager(
    (chatViewModel: ChatViewModel) =>
      chatViewModel.settingsPageViewModel.primaryChannel.value
  );

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
    this.trackChat(chatViewModel);
    this.updateIndices();
  };

  trackChat = (chatViewModel: ChatViewModel): void => {
    this.chatViewModels.add(chatViewModel);
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

  updateIndices = (): void => {
    this.indexManager.update([...this.chatViewModels.value.values()]);
    for (const chatViewModel of this.chatViewModels.value) {
      chatViewModel.updateIndex();
    }
  };

  // view
  openChat = (chatViewModel: ChatViewModel): void => {
    this.selectedChat.value = chatViewModel;
  };

  closeChat = (): void => {
    this.selectedChat.value = undefined;
  };

  // load
  loadChats = (): void => {
    this.chatViewModels.clear();
    for (const chatModel of this.chatListModel.chatModels.values()) {
      const chatViewModel = this.createChatViewModel(chatModel);
      this.trackChat(chatViewModel);
    }
    this.updateIndices();
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
