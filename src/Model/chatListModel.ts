import StorageModel, { storageKeys } from "./storageModel";

import { ChatModel } from "./chatModel";
import { localeCompare } from "./Utility/utility";
import { v4 } from "uuid";

export default class ChatListModel {
  storageModel: StorageModel;

  // data
  chatModels = new Set<ChatModel>();
  sortedPrimaryChannels: string[] = [];

  // store & add
  addChatModel = (chatModel: ChatModel) => {
    this.chatModels.add(chatModel);
    this.updateIndices();
  };

  createChat = (primaryChannel: string): ChatModel => {
    const id: string = v4();

    const chatModel = new ChatModel(this.storageModel, this, id);
    chatModel.setPrimaryChannel(primaryChannel);

    this.addChatModel(chatModel);
    return chatModel;
  };

  untrackChat = (chat: ChatModel): void => {
    this.chatModels.delete(chat);
    this.updateIndices();
  };

  // sorting
  updateIndices = () => {
    this.sortedPrimaryChannels = [];

    let allChannels: string[] = [];
    for (const chatModel of this.chatModels) {
      allChannels.push(chatModel.info.primaryChannel);
    }

    this.sortedPrimaryChannels = allChannels.sort(localeCompare);
  };

  // restore
  loadChats = (): void => {
    const chatDir = storageKeys.chats;
    const chatIds = this.storageModel.list(chatDir);
    for (const chatId of chatIds) {
      const chatModel = new ChatModel(this.storageModel, this, chatId);
      this.addChatModel(chatModel);
    }
  };

  // init
  constructor(storageModel: StorageModel) {
    this.storageModel = storageModel;
    this.loadChats();
  }
}
