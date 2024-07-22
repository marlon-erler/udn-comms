// thile file is responsible for managing task files within chats.

import {
  DATA_VERSION,
  checkMatchesObjectStructure,
} from "../Utility/typeSafety";
import FileModel, { FileVersion } from "./fileModel";

import ChatModel from "../Chat/chatModel";
import { Color } from "../../ViewModel/colors";
import StorageModel from "../Global/storageModel";
import { v4 } from "uuid";

export default class TaskModel {
  storageModel: StorageModel;
  chatModel: ChatModel;
  fileModel: FileModel;

  // paths
  getBasePath = (): string[] => {
    return this.fileModel.getModelContainerPath("taskModel");
  };

  getBoardFilePath = (boardId: string): string[] => {
    return [...this.fileModel.getFilePath(boardId), boardId];
  };

  getBoardContainerPath = (): string[] => {
    return [...this.getBasePath(), subDirectories.boards];
  };

  getBoardDirectoryPath = (boardId: string): string[] => {
    return [...this.getBoardContainerPath(), boardId];
  };

  getTaskContainerPath = (boardId: string): string[] => {
    return [...this.getBoardDirectoryPath(boardId), subDirectories.boardTasks];
  };

  getTaskPath = (boardId: string, fileId: string): string[] => {
    return [...this.getTaskContainerPath(boardId), fileId];
  };

  getTaskContentPath = (
    boardId: string,
    fileId: string,
    versionId: string
  ): string[] => {
    return [...this.getTaskPath(boardId, fileId), versionId];
  };

  // handler
  handleFileVersion = (fileVersion: FileVersion<string>): void => {
    if (
      checkMatchesObjectStructure(fileVersion, BoardInfoFileVersionReference) ==
      true
    ) {
      this.handleBoard(fileVersion as BoardInfoVersion);
    } else if (
      checkMatchesObjectStructure(fileVersion, TaskFileVersionReference) == true
    ) {
      this.handleTask(fileVersion as TaskFileVersion);
    }
  };

  handleBoard = (boardInfoFileVersion: BoardInfoVersion) => {
    console.log("board", boardInfoFileVersion);
  };

  handleTask = (taskFileVersion: TaskFileVersion) => {};

  // boards
  createBoard = (name: string): void => {
    const boardInfoFileVersion: BoardInfoVersion =
      TaskModel.createBoardInfoFileVersion(v4(), name, Color.Standard);
    this.createOrUpdateBoard(boardInfoFileVersion);
  };

  listBoardIds = (): string[] => {
    const boardContainerPath: string[] = this.getBoardContainerPath();
    const boardNames: string[] = this.storageModel.list(boardContainerPath);
    return boardNames;
  };

  getBoardInfo = (fileId: string): BoardInfoVersion | null => {
    const boardInfoFileVersionOrNull: BoardInfoVersion | null =
      this.fileModel.getLatestFileVersion(
        fileId,
        BoardInfoFileVersionReference
      );
    return boardInfoFileVersionOrNull;
  };

  createOrUpdateBoard = (boardInfoFileVersion: BoardInfoVersion): void => {
    // store info
    this.fileModel.addFileVersion(boardInfoFileVersion);

    // add to list
    const boardDirectoryPath: string[] = this.getBoardDirectoryPath(
      boardInfoFileVersion.fileId
    );
    this.storageModel.write(boardDirectoryPath, "");
  };

  //tasks
  createTask = (boardId: string, name: string): void => {
    const taskFileVersion: TaskFileVersion = TaskModel.createTaskFileVersion(
      v4(),
      boardId,
      name
    );
    this.fileModel.addFileVersion(taskFileVersion);
  };

  listTaskIds = (boardName: string): string[] => {
    const getTaskDirPath: string[] = this.getTaskContainerPath(boardName);
    const fileIds: string[] = this.storageModel.list(getTaskDirPath);
    return fileIds;
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
  static createBoardInfoFileVersion = (
    fileId: string,
    name: string,
    color: Color
  ): BoardInfoVersion => {
    const fileVersion: FileVersion<"board-info"> = FileModel.createFileVersion(
      fileId,
      "board-info"
    );
    return {
      ...fileVersion,

      name,
      color,
    };
  };

  static createTaskFileVersion = (
    fileId: string,
    name: string,
    boardId: string
  ): TaskFileVersion => {
    const fileVersion: FileVersion<"task"> = FileModel.createFileVersion(
      fileId,
      "task"
    );
    return {
      ...fileVersion,

      name,
      boardId,
    };
  };
}

export const subDirectories = {
  boards: "boards",
  boardTasks: "tasks",
};

// types
export interface BoardInfoVersion extends FileVersion<"board-info"> {
  name: string;
  color: Color;
}

export interface TaskFileVersion extends FileVersion<"task"> {
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
export const BoardInfoFileVersionReference: BoardInfoVersion = {
  dataVersion: DATA_VERSION,

  fileId: "string",
  fileVersionId: "",
  creationDate: "",

  type: "board-info",

  name: "",
  color: "" as Color,
};

export const TaskFileVersionReference: TaskFileVersion = {
  dataVersion: DATA_VERSION,

  fileId: "string",
  fileVersionId: "",
  creationDate: "",
  type: "task",

  name: "",
  boardId: "",
};
