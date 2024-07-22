import * as React from "bloatless-react";

import ChatModel, { ChatMessage } from "../../Model/Chat/chatModel";
import StorageModel, { filePaths } from "../../Model/Global/storageModel";

import ChatListViewModel from "./chatListViewModel";
import { FileContent } from "../../Model/Files/fileModel";
import MessagePageViewModel from "../Pages/messagePageViewModel";
import SettingsPageViewModel from "../Pages/settingsPageViewModel";
import SettingsViewModel from "../Global/settingsViewModel";
import TaskPageViewModel from "../Pages/taskPageViewModel";

export default class ChatViewModel {
  chatModel: ChatModel;
  storageModel: StorageModel;
  settingsViewModel: SettingsViewModel;
  chatListViewModel: ChatListViewModel;

  taskPageViewModel: TaskPageViewModel;
  messagePageViewModel: MessagePageViewModel;
  settingsPageViewModel: SettingsPageViewModel;

  // state
  index: React.State<number> = new React.State(0);

  selectedPage: React.State<ChatPageType> = new React.State<ChatPageType>(
    ChatPageType.Messages
  );

  // sorting
  updateIndex = (): void => {
    this.index.value = this.chatModel.index;
  };

  // view
  open = (): void => {
    this.chatListViewModel.openChat(this);
  };

  close = (): void => {
    this.chatListViewModel.closeChat();
  };

  // load
  loadPageSelection = (): void => {
    const path: string[] = StorageModel.getPath(
      "chat",
      filePaths.chat.lastUsedPage(this.chatModel.id)
    );
    const lastUsedPage: string | null = this.storageModel.read(path);
    if (lastUsedPage != null) {
      this.selectedPage.value = lastUsedPage as any;
    }

    this.selectedPage.subscribeSilent((newPage) => {
      this.storageModel.write(path, newPage);
    });
  };

  // init
  constructor(
    chatModel: ChatModel,
    storageModel: StorageModel,
    settingsViewModel: SettingsViewModel,
    chatListViewModel: ChatListViewModel
  ) {
    // models
    this.chatModel = chatModel;
    this.storageModel = storageModel;
    this.settingsViewModel = settingsViewModel;
    this.chatListViewModel = chatListViewModel;

    // page viewModels
    this.taskPageViewModel = new TaskPageViewModel(
      this.chatModel.fileModel.taskModel,
      this.storageModel
    );
    this.messagePageViewModel = new MessagePageViewModel(this);
    this.settingsPageViewModel = new SettingsPageViewModel(this);

    // handlers
    chatModel.setMessageHandler((chatMessage: ChatMessage) => {
      this.messagePageViewModel.showChatMessage(chatMessage);
    });
    chatModel.fileModel.setFileContentHandler(
      (fileContent: FileContent<string>) => {
        this.taskPageViewModel.handleFileContent(fileContent);
      }
    );

    // load
    this.loadPageSelection();
    this.updateIndex();
  }
}

// types
export enum ChatPageType {
  Settings = "settings",
  Messages = "messages",
  Tasks = "tasks",
  Calendar = "calendar",
}
