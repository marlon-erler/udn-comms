// thile file is responsible for managing boards within chats and tasks within boards.

import {
  DATA_VERSION,
  checkMatchesObjectStructure,
} from "../Utility/typeSafety";
import FileModel, { FileContent, FileModelSubPath } from "./fileModel";

import ChatModel from "../Chat/chatModel";
import { Color } from "../../colors";
import { HandlerManager } from "../Utility/utility";
import StorageModel from "../Global/storageModel";
import { v4 } from "uuid";

export default class BoardModel {
  storageModel: StorageModel;
  chatModel: ChatModel;
  fileModel: FileModel;

  // data
  boardHandlerManager: HandlerManager<BoardInfoFileContent> =
    new HandlerManager();

  // paths
  getBasePath = (): string[] => {
    return this.fileModel.getModelContainerPath(FileModelSubPath.ModelTask);
  };

  getViewPath = (): string[] => {
    return [...this.getBasePath(), FileModelSubPath.ModelView];
  };

  getBoardFilePath = (boardId: string): string[] => {
    return [...this.fileModel.getFilePath(boardId)];
  };

  getTaskFilePath = (taskId: string): string[] => {
    return [...this.fileModel.getFilePath(taskId)];
  };

  getBoardContainerPath = (): string[] => {
    return [...this.getBasePath(), TaskModelSubPaths.Boards];
  };

  getBoardDirectoryPath = (boardId: string): string[] => {
    return [...this.getBoardContainerPath(), boardId];
  };

  getTaskContainerPath = (boardId: string): string[] => {
    return [
      ...this.getBoardDirectoryPath(boardId),
      TaskModelSubPaths.BoardTasks,
    ];
  };

  getTaskReferencePath = (boardId: string, fileId: string): string[] => {
    return [...this.getTaskContainerPath(boardId), fileId];
  };

  // handlers
  handleFileContent = (fileContent: FileContent<string>): void => {
    if (
      checkMatchesObjectStructure(fileContent, BoardInfoFileContentReference) ==
      true
    ) {
      this.handleBoard(fileContent as BoardInfoFileContent);
    } else if (
      checkMatchesObjectStructure(fileContent, TaskFileContentReference) == true
    ) {
      this.handleTask(fileContent as TaskFileContent);
    }
  };

  handleBoard = (boardInfoFileContent: BoardInfoFileContent) => {
    this.updateBoard(boardInfoFileContent);
  };

  handleTask = (taskFileContent: TaskFileContent) => {
    this.storeTask(taskFileContent);
  };

  // boards
  createBoard = (name: string): BoardInfoFileContent => {
    const boardInfoFileContent: BoardInfoFileContent =
      BoardModel.createBoardInfoFileContent(v4(), name, Color.Standard);
    this.updateBoard(boardInfoFileContent);
    return boardInfoFileContent;
  };

  updateBoard = (boardInfoFileContent: BoardInfoFileContent): void => {
    this.storeBoard(boardInfoFileContent);
    this.chatModel.sendMessage("", boardInfoFileContent);
    this.boardHandlerManager.trigger(boardInfoFileContent);
  };

  storeBoard = (boardInfoFileContent: BoardInfoFileContent): void => {
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

  listBoardIds = (): string[] => {
    const boardContainerPath: string[] = this.getBoardContainerPath();
    const boardIds: string[] = this.storageModel.list(boardContainerPath);
    return boardIds;
  };

  getBoardInfo = (fileId: string): BoardInfoFileContent | null => {
    const boardInfoFileContentOrNull: BoardInfoFileContent | null =
      this.fileModel.getLatestFileContent(
        fileId,
        BoardInfoFileContentReference
      );
    return boardInfoFileContentOrNull;
  };

  //tasks
  createTask = (boardId: string): TaskFileContent => {
    const taskFileContent: TaskFileContent = BoardModel.createTaskFileContent(
      v4(),
      "",
      boardId
    );
    return taskFileContent;
  };

  updateTask = (taskFileContent: TaskFileContent): void => {
    this.storeTask(taskFileContent);
    this.chatModel.sendMessage("", taskFileContent);
  };

  storeTask = (taskFileContent: TaskFileContent): void => {
    // store info
    this.fileModel.addFileContent(taskFileContent);

    // add to board
    const taskReferencePath: string[] = this.getTaskReferencePath(
      taskFileContent.boardId,
      taskFileContent.fileId
    );
    console.log("storing", taskReferencePath);
    this.storageModel.write(taskReferencePath, "");
  };

  listTaskIds = (boardId: string): string[] => {
    const taskContainerPath: string[] = this.getTaskContainerPath(boardId);
    console.log("listing", taskContainerPath);
    const fileIds: string[] = this.storageModel.list(taskContainerPath);
    return fileIds;
  };

  getTaskFileContent = (taskId: string): TaskFileContent | null => {
    const taskFileContentOrNull: TaskFileContent | null =
      this.fileModel.getLatestFileContent(taskId, TaskFileContentReference);
    return taskFileContentOrNull;
  };

  deleteTask = (boardId: string, taskId: string): void => {
    const taskFilePath: string[] = this.getTaskFilePath(taskId);
    const taskReferencePath: string[] = this.getTaskReferencePath(
      boardId,
      taskId
    );

    this.storageModel.removeRecursively(taskFilePath);
    this.storageModel.removeRecursively(taskReferencePath);
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

    // handlers
    fileModel.fileContentHandlerManager.addHandler(this.handleFileContent);
  }

  // utility
  static createBoardInfoFileContent = (
    fileId: string,
    name: string,
    color: Color
  ): BoardInfoFileContent => {
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

export enum TaskModelSubPaths {
  Boards = "boards",
  BoardTasks = "tasks",
}

// types
export interface BoardInfoFileContent extends FileContent<"board-info"> {
  name: string;
  color: Color;
}

export interface TaskFileContent extends FileContent<"task"> {
  name: string;
  boardId: string;

  category?: string;
  status?: string;

  description?: string;

  priority?: string;
  date?: string;
  time?: string;
}

// reference
export const BoardInfoFileContentReference: BoardInfoFileContent = {
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
