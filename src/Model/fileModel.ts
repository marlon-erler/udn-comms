// this file is responsible for managing files within chats.

import ChatModel, { ChatMessage } from "./chatModel";

import { parseValidObject } from "./Utility/utility";

export default class FileModel {
  chatModel: ChatModel;

  // handler
  handleStringifiedFile = (stringifiedFile: string): void => {
    const file: File | null = parseValidObject<File>(stringifiedFile);
    if (file == null) return;
  };

  // methods
  addFile = (file: File): void => {
    this.chatModel.sendMessage("", file);
  };

  // init
  constructor(chatModel: ChatModel) {
    this.chatModel = chatModel;
  }
}

// types
export interface File {
  dataVersion: "v2";

  id: string;
  title: string;

  contentVersions: { [id: string]: FileContent };
}

export interface FileContent {
  dataVersion: "v2";

  id: string;
  creationDate: string;
}
