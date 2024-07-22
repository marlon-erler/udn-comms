// thile file is responsible for managing task files within chats.

import {
  DATA_VERSION,
  ValidObject,
  checkMatchesObjectStructure,
} from "../Utility/typeSafety";
import FileModel, {
  File,
  FileContent,
  FileContentReference,
} from "./fileModel";

import ChatModel from "../Chat/chatModel";
import StorageModel from "../Global/storageModel";

export default class TaskModel {
  storageModel: StorageModel;
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

  getTaskContentPath = (
    boardName: string,
    fileId: string,
    contentName
  ): string[] => {
    return [...this.getTaskPath(boardName, fileId), contentName];
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
  getTaskLocation = (file: File): TaskLocation | null => {
    const locationPath: string[] = this.getTaskLocationPath(file.id);
    const locationOrNull: TaskLocation | null =
      this.storageModel.readStringifiable(locationPath, TaskLocationReference);
    return locationOrNull;
  };

  storeTaskLocation = (file: File, taskLocation: TaskLocation): void => {
    const locationPath: string[] = this.getTaskLocationPath(file.id);
    this.storageModel.writeStringifiable(locationPath, taskLocation);
  };

  updateTaskLocation = (file: File, newLocation: TaskLocation): boolean => {
    const previousLocation: TaskLocation | null = this.getTaskLocation(file);
    if (previousLocation == null) return false;

    const oldBoardName: string = previousLocation.board;
    const sourcePath: string[] = this.getTaskPath(oldBoardName, file.id);

    const newBoardName: string = newLocation.board;
    const destinationPath: string[] = this.getTaskPath(newBoardName, file.id);

    return this.storageModel.rename(sourcePath, destinationPath);
  };

  // storage
  listBoardsNames = (): string[] => {
    const boardDirPath: string[] = this.getBoardDirPath();
    const boardNames: string[] = this.storageModel.list(boardDirPath);
    return boardNames;
  };

  listFileIdsOfBoard = (boardName: string): string[] => {
    const boardPath: string[] = this.getBoardPath(boardName);
    const fileIds: string[] = this.storageModel.list(boardPath);
    return fileIds;
  };

  getTaskVersionNames = (boardName: string, fileId: string): string[] => {
    const fileDirectoryPath: string[] = this.getTaskPath(boardName, fileId);
    const versionNames: string[] = this.storageModel.list(fileDirectoryPath);
    return versionNames;
  };

  getTaskFileContent = (
    boardName: string,
    fileId: string,
    versionName: string
  ): TaskFileContent | null => {
    const fileContentPath: string[] = this.getTaskContentPath(
      boardName,
      fileId,
      versionName
    );
    const taskFileContentOrNull: TaskFileContent | null =
      this.storageModel.readStringifiable(
        fileContentPath,
        TaskFileContentReference
      );
    return taskFileContentOrNull;
  };

  // init
  constructor(
    storageModel: StorageModel,
    chatModel: ChatModel,
    fileModel: FileModel
  ) {
    this.chatModel = chatModel;
    this.fileModel = fileModel;
    this.storageModel = storageModel;
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
