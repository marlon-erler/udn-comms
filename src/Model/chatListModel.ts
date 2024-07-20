import StorageModel, { storageKeys } from "./storageModel";

import { ChatModel } from "./chatModel";
import { v4 } from "uuid";

export default class ChatListModel {
  storageModel: StorageModel;

  // data
  chatModels = new Map<string, ChatModel>();

  // store & add
  addChatModel(chatModel: ChatModel) {
    this.chatModels.set(chatModel.id, chatModel);
  }

  createChat = (primaryChannel: string): void => {
    const id: string = v4();

    const chatModel = new ChatModel(this.storageModel, id);
    chatModel.setPrimaryChannel(primaryChannel);

    this.addChatModel(chatModel);
  };

  deleteChat = (chatId: string): void => {
    const chat = this.chatModels.get(chatId);
    if (!chat) return;

    chat.remove();
    this.untrackChat(chatId);
  };

  untrackChat = (chatId: string): void => {
    const chat = this.chatModels.get(chatId);
    if (!chat) return;

    this.chatModels.delete(chatId);
  };

  // restore
  loadChats = (): void => {
    const chatDir = storageKeys.chats;
    for (const chatId of chatDir) {
      const chatModel = new ChatModel(this.storageModel, chatId);
      this.addChatModel(chatModel);
    }
  };

  // init
  constructor(storageModel: StorageModel) {
    this.storageModel = storageModel;
  }
}
