// thile file is responsible for managing task files within chats.

import {
  DATA_VERSION,
  ValidObject,
  checkMatchesObjectStructure,
} from "../Utility/typeSafety";
import FileModel, { File, FileContent } from "./fileModel";

import ChatModel from "../Chat/chatModel";

export default class TaskModel {
  chatModel: ChatModel;
  fileModel: FileModel;

  // paths
  getBasePath = (): string[] => {
    return this.fileModel.getModelDirectoryPath("taskModel");
  };

  getLocationDirPath = (): string[] => {
    return [...this.getBasePath(), subDirectories.locations];
  };

  getTaskLocationPath = (fileId: string): string[] => {
    return [...this.getLocationDirPath(), fileId];
  };

  getBoardDirPath = (): string[] => {
    return [...this.getBasePath(), subDirectories.boards];
  };

  getBoardPath = (boardName: string): string[] => {
    return [...this.getBoardDirPath(), boardName];
  };

  getTaskPath = (boardName: string, fileId: string): string[] => {
    return [...this.getBoardPath(boardName), fileId];
  };

  // handler
  handleTaskFileContent = (
    file: File,
    fileContent: FileContent<string>
  ): void => {
    if (
      checkMatchesObjectStructure(fileContent, TaskFileContentReference) ==
      false
    )
      return;

    // TODO handle
  };

  // methods
  createTask = (board: string, name: string): void => {
    const file: File = FileModel.createFile();
    const taskFileContent: TaskFileContent = TaskModel.createTaskFileContent(
      board,
      name
    );
    this.saveTask(file, taskFileContent);
  };

  saveTask = (file: File, newTaskFileContent: TaskFileContent): void => {
    file.contentVersions.add(newTaskFileContent);
    this.fileModel.addOrUpdateFile(file);
  };

  // locations
  updateTaskLocation = (
    file: File,
    taskFileContent: TaskFileContent
  ): void => {};

  // init
  constructor(chatModel: ChatModel, fileModel: FileModel) {
    this.chatModel = chatModel;
    this.fileModel = fileModel;
  }

  // utility
  static createTaskFileContent = (
    name: string,
    board: string
  ): TaskFileContent => {
    const fileContent: FileContent<"task"> =
      FileModel.createFileContent("task");
    return {
      ...fileContent,

      name,
      board,
    };
  };
}

export const subDirectories = {
  locations: "locations",
  boards: "boards",
};

// types
export interface TaskFileContent extends FileContent<"task"> {
  name: string;
  board: string;

  category?: string;
  status?: string;

  description?: string;

  priority?: number;
  date?: string;
  time?: string;
}

export interface TaskLocation extends ValidObject {
  board: string;
  category?: string;
  status?: string;
}

// reference
export const TaskFileContentReference: TaskFileContent = {
  dataVersion: DATA_VERSION,

  id: "",
  creationDate: "",
  type: "task",

  name: "",
  board: "",
};

export const TaskLocationReference: TaskLocation = {
  dataVersion: DATA_VERSION,

  board: "",
};
