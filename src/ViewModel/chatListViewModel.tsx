import * as React from "bloatless-react";

import ChatListModel from "../Model/chatListModel";
import { ChatModel } from "../Model/chatModel";
import StorageModel from "../Model/storageModel";

export default class ChatListViewModel {
  chatListModel: ChatListModel;

  // state
  newChatPrimaryChannel: React.State<string> = new React.State("");
  chatModels: React.ListState<ChatModel> = new React.ListState();

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
    this.chatModels.add(chatModel);
  };

  deleteChat = (chat: ChatModel): void => {
    this.chatListModel.deleteChat(chat);
    this.chatModels.remove(chat);
  };

  // restore
  restoreChats = (): void => {
    for (const chat of this.chatListModel.chatModels.values()) {
      this.chatModels.add(chat);
    }
  };

  // init
  constructor(storageModel: StorageModel) {
    const chatListModel = new ChatListModel(storageModel);
    this.chatListModel = chatListModel;

    this.restoreChats();
  }
}
