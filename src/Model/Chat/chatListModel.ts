import StorageModel, { filePaths } from "../Global/storageModel";

import ChatModel from "./chatModel";
import ConnectionModel from "../Global/connectionModel";
import { Message } from "udn-frontend";
import SettingsModel from "../Global/settingsModel";
import { localeCompare } from "../Utility/utility";
import { v4 } from "uuid";

export default class ChatListModel {
  storageModel: StorageModel;
  settingsModel: SettingsModel;
  connectionModel: ConnectionModel;

  // data
  chatModels = new Set<ChatModel>();
  sortedPrimaryChannels: string[] = [];

  // handlers
  messageHandler = (data: Message): void => {
    for (const chatModel of this.chatModels) {
      const channel: string | undefined = data.messageChannel;
      const body: string | undefined = data.messageBody;
      if (channel == undefined) return;
      if (body == undefined) return;

      const allChannels = channel.split("/");
      for (const channel of allChannels) {
        if (channel != chatModel.info.primaryChannel) continue;
        chatModel.handleMessage(body);
        break;
      }
    }
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

  getIndexOfPrimaryChannel(primaryChannel: string): number {
    return this.sortedPrimaryChannels.indexOf(primaryChannel);
  }

  // storage
  addChatModel = (chatModel: ChatModel) => {
    this.chatModels.add(chatModel);
    this.updateIndices();
  };

  createChat = (primaryChannel: string): ChatModel => {
    const id: string = v4();

    const chatModel = new ChatModel(
      this.storageModel,
      this.connectionModel,
      this.settingsModel,
      this,
      id
    );
    chatModel.setPrimaryChannel(primaryChannel);

    this.addChatModel(chatModel);
    return chatModel;
  };

  untrackChat = (chat: ChatModel): void => {
    this.chatModels.delete(chat);
    this.updateIndices();
  };

  // load
  loadChats = (): void => {
    const chatDir = StorageModel.getPath("chat", filePaths.chat.base);
    const chatIds = this.storageModel.list(chatDir);
    for (const chatId of chatIds) {
      const chatModel = new ChatModel(
        this.storageModel,
        this.connectionModel,
        this.settingsModel,
        this,
        chatId
      );
      this.addChatModel(chatModel);
    }
  };

  // init
  constructor(
    storageModel: StorageModel,
    settingsModel: SettingsModel,
    connectionModel: ConnectionModel
  ) {
    this.storageModel = storageModel;
    this.settingsModel = settingsModel;
    this.connectionModel = connectionModel;
    this.loadChats();

    connectionModel.setMessageHandler(this.messageHandler);
  }
}
