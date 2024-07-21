import * as React from "bloatless-react";

import ChatModel, { ChatMessage } from "../Model/chatModel";
import StorageModel, { storageKeys } from "../Model/storageModel";

import ChatListViewModel from "./chatListViewModel";
import ChatMessageViewModel from "./chatMessageViewModel";
import { Color } from "./colors";
import SettingsViewModel from "./settingsViewModel";
import { localeCompare } from "../Model/Utility/utility";

export default class ChatViewModel {
  chatModel: ChatModel;
  storageModel: StorageModel;
  settingsViewModel: SettingsViewModel;
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

  chatMessageViewModels: React.MapState<ChatMessageViewModel> =
    new React.MapState();
  composingMessage: React.State<string> = new React.State("");

  // guards
  cannotSetPrimaryChannel: React.State<boolean> = React.createProxyState(
    [this.primaryChannel, this.primaryChannelInput],
    () =>
      this.primaryChannelInput.value == "" ||
      this.primaryChannelInput.value == this.primaryChannel.value
  );
  cannotAddSecondaryChannel: React.State<boolean> = React.createProxyState(
    [this.newSecondaryChannelInput],
    () => this.newSecondaryChannelInput.value == ""
  );
  cannotSetEncryptionKey: React.State<boolean>;
  cannotSendMessage: React.State<boolean>;

  // sorting
  updateIndex = (): void => {
    this.index.value = this.chatModel.index;
  };

  // view
  open = (): void => {
    this.chatListViewModel.openChat(this);
    this.loadMessages();
  };

  close = (): void => {
    this.chatListViewModel.closeChat();
  };

  // add
  addChatMessage = (chatMessage: ChatMessage): void => {
    const chatMessageModel = new ChatMessageViewModel(
      this,
      chatMessage,
      chatMessage.sender == this.settingsViewModel.username.value
    );

    const existingChatMessageViewModel: ChatMessageViewModel | undefined =
      this.chatMessageViewModels.value.get(chatMessage.id);
    if (existingChatMessageViewModel != undefined) {
      existingChatMessageViewModel.body.value = chatMessage.body;
      existingChatMessageViewModel.status.value = chatMessage.status;
    } else {
      this.chatMessageViewModels.set(chatMessage.id, chatMessageModel);
    }
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
    this.loadSecondaryChannels();
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
    this.chatListViewModel.loadChats();
  };

  // messaging
  sendMessage = (): void => {
    if (this.cannotSendMessage.value == true) return;
    
    this.sendMessageFromBody(this.composingMessage.value);
    this.composingMessage.value = "";
  };

  sendMessageFromBody = (body: string): void => {
    this.chatModel.sendMessage(body);
  };

  decryptMessage = async (
    messageViewModel: ChatMessageViewModel
  ): Promise<void> => {
    const chatMessage: ChatMessage = messageViewModel.chatMessage;
    await this.chatModel.decryptMessage(chatMessage);
    this.chatModel.addMessage(chatMessage);
    messageViewModel.loadData();
  };

  // load
  loadPageSelection = (): void => {
    const path: string[] = storageKeys.chatLastUsedPage(this.chatModel.id);
    const lastUsedPage: string | null = this.storageModel.read(path);
    if (lastUsedPage != null) {
      this.selectedPage.value = lastUsedPage as any;
    }

    this.selectedPage.subscribeSilent((newPage) => {
      this.storageModel.write(path, newPage);
    });
  };

  loadSecondaryChannels = (): void => {
    this.secondaryChannels.clear();
    for (const secondaryChannel of this.chatModel.info.secondaryChannels.sort(
      localeCompare
    )) {
      this.secondaryChannels.add(secondaryChannel);
    }
  };

  loadMessages = (): void => {
    for (const chatMessage of this.chatModel.messages) {
      this.addChatMessage(chatMessage);
    }
  }

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

    // handlers
    chatModel.setMessageHandler((chatMessage) => {
      this.addChatMessage(chatMessage);
    });

    // load
    this.primaryChannel.value = chatModel.info.primaryChannel;
    this.primaryChannelInput.value = chatModel.info.primaryChannel;

    this.encryptionKeyInput.value = chatModel.info.encryptionKey;
    this.cannotSetEncryptionKey = React.createProxyState(
      [this.encryptionKeyInput],
      () => this.encryptionKeyInput.value == this.chatModel.info.encryptionKey
    );

    this.color.value = chatModel.color;

    this.loadSecondaryChannels();
    this.loadPageSelection();
    this.updateIndex();

    // guards
    this.cannotSendMessage = React.createProxyState(
      [this.settingsViewModel.username, this.composingMessage],
      () =>
        this.settingsViewModel.username.value == "" ||
        this.composingMessage.value == ""
    );
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
