// thile file is responsible for managing task files within chats.

import {
  DATA_VERSION,
  checkMatchesObjectStructure,
} from "../Utility/typeSafety";
import FileModel, { FileContent } from "./fileModel";

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
    return [...this.fileModel.getFilePath(boardId)];
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
  handleFileContent = (fileContent: FileContent<string>): void => {
    if (
      checkMatchesObjectStructure(fileContent, BoardInfoFileContentReference) ==
      true
    ) {
      this.handleBoard(fileContent as BoardInfoVersion);
    } else if (
      checkMatchesObjectStructure(fileContent, TaskFileContentReference) == true
    ) {
      this.handleTask(fileContent as TaskFileContent);
    }
  };

  handleBoard = (boardInfoFileContent: BoardInfoVersion) => {
    console.log("board", boardInfoFileContent);
  };

  handleTask = (taskFileContent: TaskFileContent) => {};

  // boards
  createBoard = (name: string): void => {
    const boardInfoFileContent: BoardInfoVersion =
      TaskModel.createBoardInfoFileContent(v4(), name, Color.Standard);
    this.createOrUpdateBoard(boardInfoFileContent);
  };

  listBoardIds = (): string[] => {
    const boardContainerPath: string[] = this.getBoardContainerPath();
    const boardNames: string[] = this.storageModel.list(boardContainerPath);
    return boardNames;
  };

  getBoardInfo = (fileId: string): BoardInfoVersion | null => {
    const boardInfoFileContentOrNull: BoardInfoVersion | null =
      this.fileModel.getLatestFileContent(
        fileId,
        BoardInfoFileContentReference
      );
    return boardInfoFileContentOrNull;
  };

  createOrUpdateBoard = (boardInfoFileContent: BoardInfoVersion): void => {
    // store info
    this.fileModel.addFileContent(boardInfoFileContent);

    // add to list
    const boardDirectoryPath: string[] = this.getBoardDirectoryPath(
      boardInfoFileContent.fileId
    );
    this.storageModel.write(boardDirectoryPath, "");
  };

  deleteBoard = (boardId: string): void => {
    const boardFilePath: string[] = this.getBoardFilePath(boardId);
    const boardDirectoryPath: string[] = this.getBoardDirectoryPath(boardId);

    this.storageModel.removeRecursively(boardFilePath);
    this.storageModel.removeRecursively(boardDirectoryPath);
  };

  //tasks
  createTask = (boardId: string, name: string): void => {
    const taskFileContent: TaskFileContent = TaskModel.createTaskFileContent(
      v4(),
      boardId,
      name
    );
    this.fileModel.addFileContent(taskFileContent);
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
  static createBoardInfoFileContent = (
    fileId: string,
    name: string,
    color: Color
  ): BoardInfoVersion => {
    const fileContent: FileContent<"board-info"> = FileModel.createFileContent(
      fileId,
      "board-info"
    );
    return {
      ...fileContent,

      name,
      color,
    };
  };

  static createTaskFileContent = (
    fileId: string,
    name: string,
    boardId: string
  ): TaskFileContent => {
    const fileContent: FileContent<"task"> = FileModel.createFileContent(
      fileId,
      "task"
    );
    return {
      ...fileContent,

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
export interface BoardInfoVersion extends FileContent<"board-info"> {
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
export const BoardInfoFileContentReference: BoardInfoVersion = {
  dataVersion: DATA_VERSION,

  fileId: "string",
  fileContentId: "",
  creationDate: "",

  type: "board-info",

  name: "",
  color: "" as Color,
};

export const TaskFileContentReference: TaskFileContent = {
  dataVersion: DATA_VERSION,

  fileId: "string",
  fileContentId: "",
  creationDate: "",
  type: "task",

  name: "",
  boardId: "",
};
