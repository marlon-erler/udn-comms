import StorageModel, { storageKeys } from "./storageModel";

import { ChatModel } from "./chatModel";
import { v4 } from "uuid";

export default class ChatListModel {
  storageModel: StorageModel;

  // data
  chatModels = new Map<string, ChatModel>();

  // store & add
  addChatModel = (chatModel: ChatModel) => {
    this.chatModels.set(chatModel.id, chatModel);
  };

  createChat = (primaryChannel: string): ChatModel => {
    const id: string = v4();

    const chatModel = new ChatModel(this.storageModel, id);
    chatModel.setPrimaryChannel(primaryChannel);

    this.addChatModel(chatModel);
    return chatModel;
  };

  deleteChat = (chat: ChatModel): void => {
    chat.remove();
    this.untrackChat(chat);
  };

  untrackChat = (chat: ChatModel): void => {
    this.chatModels.delete(chat.id);
  };

  // restore
  loadChats = (): void => {
    const chatDir = storageKeys.chats;
    const chatIds = this.storageModel.list(chatDir);
    for (const chatId of chatIds) {
      const chatModel = new ChatModel(this.storageModel, chatId);
      this.addChatModel(chatModel);
    }
  };

  // init
  constructor(storageModel: StorageModel) {
    this.storageModel = storageModel;
    this.loadChats();
  }
}
