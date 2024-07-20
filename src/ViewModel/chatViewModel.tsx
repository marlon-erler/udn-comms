import * as React from "bloatless-react";

import StorageModel, { storageKeys } from "../Model/storageModel";

import ChatListViewModel from "./chatListViewModel";
import { ChatModel } from "../Model/chatModel";
import { Color } from "./colors";
import { localeCompare } from "../Model/Utility/utility";

export default class ChatViewModel {
  chatModel: ChatModel;
  chatListViewModel: ChatListViewModel;
  storageModel: StorageModel;

  // state
  index: React.State<number> = new React.State(0);

  primaryChannel: React.State<string> = new React.State("");
  primaryChannelInput: React.State<string> = new React.State("");

  secondaryChannels: React.ListState<string> = new React.ListState();
  newSecondaryChannelInput: React.State<string> = new React.State("");

  color: React.State<Color> = new React.State<Color>(Color.Standard);

  selectedPage: React.State<ChatPageType> = new React.State<ChatPageType>(
    ChatPageType.Messages
  );

  // guards
  cannotSetPrimaryChannel: React.State<boolean> = React.createProxyState(
    [this.primaryChannel, this.primaryChannelInput],
    () =>
      this.primaryChannelInput.value == "" ||
      this.primaryChannelInput.value == this.primaryChannel.value
  );

  // sorting
  updateIndex = (): void => {
    const index = this.chatListViewModel.getIndexOfChat(this);
    this.index.value = index;
  };

  // methods
  open = (): void => {
    this.chatListViewModel.openChat(this);
  };

  close = (): void => {
    this.chatListViewModel.closeChat();
  };

  setPrimaryChannel = (): void => {
    this.chatModel.setPrimaryChannel(this.primaryChannelInput.value);
    this.primaryChannel.value = this.chatModel.info.primaryChannel;
    this.chatListViewModel.updateIndices();
  };

  addSecondaryChannel = (): void => {
    this.secondaryChannels.add(this.newSecondaryChannelInput.value);
    this.newSecondaryChannelInput.value = "";
    this.storeSecondaryChannels();
    this.restoreSecondaryChannels();
  };

  removeSecondaryChannel = (secondaryChannel: string): void => {
    this.secondaryChannels.remove(secondaryChannel);
    this.storeSecondaryChannels();
  };

  storeSecondaryChannels = (): void => {
    this.chatModel.setSecondaryChannels([
      ...this.secondaryChannels.value.values(),
    ]);
  };

  setColor = (newColor: Color): void => {
    this.color.value = newColor;
    this.chatModel.setColor(newColor);
  };

  // restore
  restorePageSelection = (): void => {
    const path: string[] = storageKeys.chatLastUsedPage(this.chatModel.id);
    const lastUsedPage: string | null = this.storageModel.restore(path);
    if (lastUsedPage != null) {
      this.selectedPage.value = lastUsedPage as any;
    }

    this.selectedPage.subscribeSilent((newPage) => {
      this.storageModel.store(path, newPage);
    });
  };

  restoreSecondaryChannels = (): void => {
    this.secondaryChannels.clear();
    for (const secondaryChannel of this.chatModel.info.secondaryChannels.sort(localeCompare)) {
      this.secondaryChannels.add(secondaryChannel);
    }
  };

  // init
  constructor(chatListViewModel: ChatListViewModel, chatModel: ChatModel) {
    this.chatModel = chatModel;
    this.storageModel = chatModel.storageModel;
    this.chatListViewModel = chatListViewModel;

    this.primaryChannel.value = chatModel.info.primaryChannel;
    this.primaryChannelInput.value = chatModel.info.primaryChannel;

    this.color.value = chatModel.color;

    this.restoreSecondaryChannels();
    this.restorePageSelection();
    this.updateIndex();
  }
}

// types
export enum ChatPageType {
  Settings = "settings",
  Messages = "messages",
  AllObjects = "all",
  Kanban = "kanban",
  Calendar = "calendar",
  Progress = "progress",
}
