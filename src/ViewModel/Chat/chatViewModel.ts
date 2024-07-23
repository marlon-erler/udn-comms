import * as React from "bloatless-react";

import ChatModel, { ChatMessage } from "../../Model/Chat/chatModel";
import StorageModel, { filePaths } from "../../Model/Global/storageModel";

import ChatListViewModel from "./chatListViewModel";
import { Color } from "../../colors";
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
  displayedColor: React.State<Color> = new React.State<Color>(Color.Standard);
  selectedPage: React.State<ChatPageType> = new React.State<ChatPageType>(
    ChatPageType.Messages
  );

  index: React.State<number> = new React.State(0);

  // view
  open = (): void => {
    this.chatListViewModel.openChat(this);
  };

  close = (): void => {
    this.chatListViewModel.closeChat();
  };

  closeSubPages = (): void => {};

  setColor = (color: Color): void => {
    this.setDisplayedColor(color);
    this.chatModel.setColor(color);
  };

  setDisplayedColor = (color: Color): void => {
    this.displayedColor.value = color;
  };

  resetColor = (): void => {
    this.displayedColor.value = this.settingsPageViewModel.color.value;
  };

  updateIndex = (): void => {
    const index: number =
      this.chatListViewModel.chatIndexManager.getIndex(this);
    this.index.value = index;
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
      this.resetColor();
    });
  };

  // init
  constructor(
    storageModel: StorageModel,
    chatModel: ChatModel,
    settingsViewModel: SettingsViewModel,
    chatListViewModel: ChatListViewModel
  ) {
    // models
    this.storageModel = storageModel;
    this.chatModel = chatModel;
    this.settingsViewModel = settingsViewModel;
    this.chatListViewModel = chatListViewModel;

    // page viewModels
    this.taskPageViewModel = new TaskPageViewModel(
      this.storageModel,
      this.chatModel.fileModel.taskModel,
      this
    );
    this.messagePageViewModel = new MessagePageViewModel(this);
    this.settingsPageViewModel = new SettingsPageViewModel(this);

    // handlers
    chatModel.chatMessageHandlerManager.addHandler(
      (chatMessage: ChatMessage) => {
        this.messagePageViewModel.showChatMessage(chatMessage);
      }
    );

    // load
    this.loadPageSelection();
    this.resetColor();
  }
}

// types
export enum ChatPageType {
  Settings = "settings",
  Messages = "messages",
  Tasks = "tasks",
  Calendar = "calendar",
}
