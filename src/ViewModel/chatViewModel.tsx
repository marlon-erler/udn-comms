import * as React from "bloatless-react";

import StorageModel, { storageKeys } from "../Model/storageModel";

import ChatListViewModel from "./chatListViewModel";
import { ChatModel } from "../Model/chatModel";
import { Color } from "./colors";
import { localeCompare } from "../Model/Utility/utility";

export default class ChatViewModel {
  chatModel: ChatModel;
  storageModel: StorageModel;
  chatListViewModel: ChatListViewModel;

  // state
  index: React.State<number> = new React.State(0);

  primaryChannel: React.State<string> = new React.State("");
  primaryChannelInput: React.State<string> = new React.State("");

  secondaryChannels: React.ListState<string> = new React.ListState();
  newSecondaryChannelInput: React.State<string> = new React.State("");

  encryptionKeyInput: React.State<string> = new React.State("");
  shouldShowEncryptionKey: React.State<boolean> = new React.State(false);
  encryptionKeyInputType: React.State<"text" | "password"> =
    React.createProxyState([this.shouldShowEncryptionKey], () =>
      this.shouldShowEncryptionKey.value == true ? "text" : "password"
    );

  color: React.State<Color> = new React.State<Color>(Color.Standard);

  selectedPage: React.State<ChatPageType> = new React.State<ChatPageType>(
    ChatPageType.Messages
  );

  composingMessage: React.State<string> = new React.State("");

  // guards
  cannotSetPrimaryChannel: React.State<boolean> = React.createProxyState(
    [this.primaryChannel, this.primaryChannelInput],
    () =>
      this.primaryChannelInput.value == "" ||
      this.primaryChannelInput.value == this.primaryChannel.value
  );
  cannotSetEncryptionKey: React.State<boolean>;

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

  // settings
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

  setEncryptionKey = (): void => {
    this.chatModel.setEncryptionKey(this.encryptionKeyInput.value);

    // disable button
    this.encryptionKeyInput.callSubscriptions();
  };

  setColor = (newColor: Color): void => {
    this.color.value = newColor;
    this.chatModel.setColor(newColor);
  };

  remove = (): void => {
    this.close();
    this.chatModel.delete();
    this.chatListViewModel.restoreChats();
  }

  // messaging
  sendMessage = (): void => {
    this.chatModel.sendMessage(this.composingMessage.value);
    this.composingMessage.value = "";
  }

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
    for (const secondaryChannel of this.chatModel.info.secondaryChannels.sort(
      localeCompare
    )) {
      this.secondaryChannels.add(secondaryChannel);
    }
  };

  // init
  constructor(
    chatModel: ChatModel,
    storageModel: StorageModel,
    chatListViewModel: ChatListViewModel
  ) {
    this.chatModel = chatModel;
    this.storageModel = storageModel;
    this.chatListViewModel = chatListViewModel;

    this.primaryChannel.value = chatModel.info.primaryChannel;
    this.primaryChannelInput.value = chatModel.info.primaryChannel;

    this.encryptionKeyInput.value = chatModel.info.encryptionKey;
    this.cannotSetEncryptionKey = React.createProxyState(
      [this.encryptionKeyInput],
      () => this.encryptionKeyInput.value == this.chatModel.info.encryptionKey
    );

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
