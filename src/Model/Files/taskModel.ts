// thile file is responsible for managing task files within chats.

import FileModel, { FileContent } from "./fileModel";

import ChatModel from "../Chat/chatModel";
import { DATA_VERSION } from "../Utility/typeSafety";

export default class TaskModel {
  chatModel: ChatModel;
  fileModel: FileModel;

  // init
  constructor(chatModel: ChatModel, fileModel: FileModel) {
    this.chatModel = chatModel;
    this.fileModel = fileModel;
  }
}

// types
export interface TaskFileContent extends FileContent {
  type: "task";

  board: string;
  category?: string;
  status?: string;

  description?: string;

  priority?: number;
  date?: string;
  time?: string;
}

export const TaskFileContentReference: TaskFileContent = {
  dataVersion: DATA_VERSION,

  id: "",
  creationDate: "",
  type: "task",
  
  board: "",
};
