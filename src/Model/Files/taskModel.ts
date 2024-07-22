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
import { Color } from "../../ViewModel/colors";
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

  getBoardPath = (boardId: string): string[] => {
    return [...this.getBoardDirPath(), boardId];
  };

  getBoardInfoPath = (boardId: string): string[] => {
    return [...this.getBoardPath(boardId), subDirectories.boardInfo];
  };

  getTaskDirPath = (boardId: string): string[] => {
    return [...this.getBoardPath(boardId), subDirectories.boardTasks];
  };

  getTaskPath = (boardId: string, fileId: string): string[] => {
    return [...this.getTaskDirPath(boardId), fileId];
  };

  getTaskContentPath = (
    boardId: string,
    fileId: string,
    contentName: string
  ): string[] => {
    return [...this.getTaskPath(boardId, fileId), contentName];
  };

  // handler
  handleFileContent = (file: File, fileContent: FileContent<string>): void => {
    if (
      checkMatchesObjectStructure(fileContent, BoardInfoFileContentReference) ==
      true
    ) {
      // todo
    } else if (
      checkMatchesObjectStructure(fileContent, TaskFileContentReference) == true
    ) {
      // todo
    }
  };

  // boards
  createBoard = (name: string): void => {
    const file: File = FileModel.createFile();
    const boardInfoFileContent: BoardInfoFileContent =
      TaskModel.createBoardInfoFileContent(name, Color.Standard);
    this.fileModel.addOrUpdateFile(file, boardInfoFileContent);
  };

  listBoardIds = (): string[] => {
    const boardDirPath: string[] = this.getBoardDirPath();
    const boardNames: string[] = this.storageModel.list(boardDirPath);
    return boardNames;
  };

  getBoardInfo = (boardId: string): BoardInfoFileContent | null => {
    const boardInfoPath: string[] = this.getBoardInfoPath(boardId);
    const boardInfoFileContentOrNull: BoardInfoFileContent | null =
      this.storageModel.readStringifiable(
        boardInfoPath,
        BoardInfoFileContentReference
      );
    return boardInfoFileContentOrNull;
  };

  //tasks
  createTask = (boardId: string, name: string): void => {
    const file: File = FileModel.createFile();
    const taskFileContent: TaskFileContent = TaskModel.createTaskFileContent(
      boardId,
      name
    );
    this.fileModel.addOrUpdateFile(file, taskFileContent);
  };

  listTaskIds = (boardName: string): string[] => {
    const getTaskDirPath: string[] = this.getTaskDirPath(boardName);
    const fileIds: string[] = this.storageModel.list(getTaskDirPath);
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

  moveTask = (
    taskFileId: string,
    oldBoardId: string,
    newBoardId: string
  ): void => {
    const sourcePath: string[] = this.getTaskPath(oldBoardId, taskFileId);
    const destinationPath: string[] = this.getTaskPath(newBoardId, taskFileId);
    this.storageModel.renameRecursively(sourcePath, destinationPath);
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
  static createBoardInfoFileContent = (
    name: string,
    color: Color
  ): BoardInfoFileContent => {
    const fileContent: FileContent<"board"> =
      FileModel.createFileContent("board");
    return {
      ...fileContent,

      name,
      color,
    };
  };

  static createTaskFileContent = (
    name: string,
    boardId: string
  ): TaskFileContent => {
    const fileContent: FileContent<"task"> =
      FileModel.createFileContent("task");
    return {
      ...fileContent,

      name,
      boardId,
    };
  };
}

export const subDirectories = {
  locations: "locations",
  boards: "boards",
  boardInfo: "info",
  boardTasks: "tasks",
};

// types
export interface BoardInfoFileContent extends FileContent<"board"> {
  name: string;
  color: Color;
}

export interface TaskFileContent extends FileContent<"task"> {
  name: string;
  boardId: string;

  category?: string;
  status?: string;

  description?: string;

  priority?: number;
  date?: string;
  time?: string;
}

// reference
export const BoardInfoFileContentReference: BoardInfoFileContent = {
  dataVersion: DATA_VERSION,

  id: "",
  creationDate: "",
  type: "board",

  name: "",
  color: "" as Color,
};

export const TaskFileContentReference: TaskFileContent = {
  dataVersion: DATA_VERSION,

  id: "",
  creationDate: "",
  type: "task",

  name: "",
  boardId: "",
};
