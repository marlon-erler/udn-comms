// this file is responsible for managing files within chats.

import ChatModel from "./chatModel";

export default class FileModel {
  chatModel: ChatModel;

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
