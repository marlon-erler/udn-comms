// this file is responsible for managing chats.

import {
  DATA_VERSION,
  ValidObject,
  checkIsValidObject,
} from "./Utility/typeSafety";
import FileModel, { File } from "./fileModel";
import StorageModel, { storageKeys } from "./storageModel";
import {
  createTimestamp,
  parse,
  parseValidObject,
  stringify,
} from "./Utility/utility";
import { decryptString, encryptString } from "./Utility/crypto";

import ChatListModel from "./chatListModel";
import { Color } from "../ViewModel/colors";
import ConnectionModel from "./connectionModel";
import SettingsModel from "./settingsModel";
import { v4 } from "uuid";

export default class ChatModel {
  connectionModel: ConnectionModel;
  storageModel: StorageModel;
  settingsModel: SettingsModel;
  chatListModel: ChatListModel;

  fileModel: FileModel;

  // data
  id: string;
  info: ChatInfo;
  color: Color;

  chatMessageHandler: (chatMessage: ChatMessage) => void = () => {};

  // sorting
  get index(): number {
    return this.chatListModel.getIndexOfPrimaryChannel(
      this.info.primaryChannel
    );
  }

  // paths
  get infoPath(): string[] {
    return storageKeys.chatInfo(this.id);
  }

  get colorPath(): string[] {
    return storageKeys.chatColor(this.id);
  }

  get messageDirPath(): string[] {
    return storageKeys.chatMessages(this.id);
  }

  getMessagePath = (id: string): string[] => {
    return [...this.messageDirPath, id];
  };

  // set
  setPrimaryChannel = (primaryChannel: string): void => {
    this.info.primaryChannel = primaryChannel;
    this.storeInfo();
    this.chatListModel.updateIndices();
    this.subscribe();
  };

  setSecondaryChannels = (secondaryChannels: string[]): void => {
    this.info.secondaryChannels = secondaryChannels;
    this.storeInfo();
  };

  setEncryptionKey = (key: string): void => {
    this.info.encryptionKey = key;
    this.storeInfo();
  };

  setColor = (color: Color): void => {
    this.color = color;
    this.storeColor();
  };

  // store & add
  storeInfo = (): void => {
    this.storageModel.writeStringifiable(this.infoPath, this.info);
  };

  storeColor = (): void => {
    this.storageModel.write(this.colorPath, this.color);
  };

  addMessage = async (chatMessage: ChatMessage): Promise<void> => {
    await this.decryptMessage(chatMessage);

    // message
    if (chatMessage.body != "") {
      const messagePath: string[] = this.getMessagePath(chatMessage.id);
      this.storageModel.writeStringifiable(messagePath, chatMessage);
      this.chatMessageHandler(chatMessage);
    }

    // file
    this.fileModel.handleStringifiedFile(chatMessage.stringifiedFile);
  };

  // delete
  delete = () => {
    // untrack
    this.chatListModel.untrackChat(this);

    // delete
    const dirPath: string[] = [...storageKeys.chats, this.id];
    this.storageModel.removeRecursive(dirPath);
  };

  // load
  loadInfo = (): void => {
    const info: any = this.storageModel.readStringifiable(this.infoPath);
    if (info != null) {
      this.info = info;
    } else {
      this.info = ChatModel.generateChatInfo("0");
    }
  };

  loadColor = (): void => {
    const path: string[] = this.colorPath;
    const color: string | null = this.storageModel.read(path);
    if (!color) {
      this.color = Color.Standard;
    } else {
      this.color = color as any;
    }
  };

  get messages(): ChatMessage[] {
    const messageIds: string[] = this.storageModel.list(this.messageDirPath);
    if (!Array.isArray(messageIds)) return [];

    const messages: ChatMessage[] = [];
    for (const messageId of messageIds) {
      const messagePath: string[] = this.getMessagePath(messageId);
      const message: any = this.storageModel.readStringifiable(messagePath);
      if (checkIsValidObject(message) == false) continue;

      messages.push(message);
    }

    const sorted = messages.sort((a, b) =>
      a.dateSent.localeCompare(b.dateSent)
    );
    return sorted;
  }

  // messaging
  sendMessage = async (body: string, file?: File): Promise<boolean> => {
    const senderName = this.settingsModel.username;
    if (senderName == "") return false;

    const allChannels = [this.info.primaryChannel];
    for (const secondaryChannel of this.info.secondaryChannels) {
      allChannels.push(secondaryChannel);
    }

    const combinedChannel: string = allChannels.join("/");

    const chatMessage: ChatMessage = await ChatModel.createChatMessage(
      combinedChannel,
      senderName,
      this.info.encryptionKey,
      body,
      file
    );

    this.addMessage(chatMessage);
    this.connectionModel.sendMessageOrStore(chatMessage);
    return true;
  };

  handleMessage = (body: string): void => {
    const chatMessage: ChatMessage | null = parseValidObject<ChatMessage>(body);
    if (chatMessage == null) return;

    chatMessage.status = ChatMessageStatus.Received;
    this.addMessage(chatMessage);
  };

  handleMessageSent = (chatMessage: ChatMessage): void => {
    chatMessage.status = ChatMessageStatus.Sent;
    this.addMessage(chatMessage);
  };

  decryptMessage = async (chatMessage: ChatMessage): Promise<void> => {
    const decryptedBody: string = await decryptString(
      chatMessage.body,
      this.info.encryptionKey
    );
    const decryptedFile: string = await decryptString(
      chatMessage.stringifiedFile ?? "",
      this.info.encryptionKey
    );
    chatMessage.body = decryptedBody;
    chatMessage.stringifiedFile = decryptedFile;
  };

  setMessageHandler = (handler: (chatMessage: ChatMessage) => void): void => {
    this.chatMessageHandler = handler;
  };

  subscribe = (): void => {
    this.connectionModel.addChannel(this.info.primaryChannel);
  };

  // init
  constructor(
    storageModel: StorageModel,
    connectionModel: ConnectionModel,
    settingsModel: SettingsModel,
    chatListModel: ChatListModel,
    chatId: string
  ) {
    this.id = chatId;
    this.connectionModel = connectionModel;
    this.settingsModel = settingsModel;
    this.storageModel = storageModel;
    this.chatListModel = chatListModel;

    this.loadInfo();
    this.loadColor();
    this.subscribe();

    connectionModel.setMessageSentHandler(this.handleMessageSent);

    this.fileModel = new FileModel(this, this.storageModel);
  }

  // utility
  static generateChatInfo = (primaryChannel: string): ChatInfo => {
    return {
      dataVersion: DATA_VERSION,

      primaryChannel,
      secondaryChannels: [],
      encryptionKey: "",
      hasUnreadMessages: false,
    };
  };

  static createChatMessage = async (
    channel: string,
    sender: string,
    encryptionKey: string,
    body: string,
    file?: File
  ): Promise<ChatMessage> => {
    const chatMessage: ChatMessage = {
      dataVersion: DATA_VERSION,

      id: v4(),

      channel,
      sender,
      body,
      dateSent: createTimestamp(),

      status: ChatMessageStatus.Outbox,
      stringifiedFile: "",
    };
    if (file != undefined) {
      const stringifiedFile = stringify(file);
      chatMessage.stringifiedFile = stringifiedFile;
    }

    if (encryptionKey != "") {
      chatMessage.body = await encryptString(chatMessage.body, encryptionKey);
      chatMessage.stringifiedFile = await encryptString(
        chatMessage.stringifiedFile,
        encryptionKey
      );
    }

    return chatMessage;
  };
}

// types
export interface ChatInfo extends ValidObject {
  primaryChannel: string;
  secondaryChannels: string[];
  encryptionKey: string;

  hasUnreadMessages: boolean;
}

export const ChatInfoReference: ChatInfo = {
  dataVersion: DATA_VERSION,

  primaryChannel: "",
  secondaryChannels: [""],
  encryptionKey: "",

  hasUnreadMessages: true,
};

export enum ChatMessageStatus {
  Outbox = "outbox",
  Sent = "sent",
  Received = "received",
}

export interface ChatMessage extends ValidObject {
  id: string;

  channel: string;
  sender: string;
  body: string;
  dateSent: string;

  status: ChatMessageStatus;

  stringifiedFile: string;
}

export const ChatMessageReference: ChatMessage = {
  dataVersion: DATA_VERSION,

  id: "",

  channel: "",
  sender: "",
  body: "",
  dateSent: "",

  status: "" as ChatMessageStatus,

  stringifiedFile: "",
};
