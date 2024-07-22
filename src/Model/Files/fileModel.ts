// this file is responsible for managing files within chats.

import { DATA_VERSION, ValidObject } from "../Utility/typeSafety";
import StorageModel, { filePaths } from "../Global/storageModel";
import {
  createTimestamp,
  parseValidObject,
  stringify,
} from "../Utility/utility";

import ChatModel from "../Chat/chatModel";
import { Color } from "../../ViewModel/colors";
import TaskModel from "./taskModel";
import { v4 } from "uuid";

export default class FileModel {
  chatModel: ChatModel;
  storageModel: StorageModel;

  taskModel: TaskModel;

  // paths
  getBasePath = (): string[] => {
    return StorageModel.getPath(
      "chat",
      filePaths.chat.files(this.chatModel.id)
    );
  };

  getFileContainerPath = (): string[] => {
    return [...this.getBasePath(), subDirectories.data];
  };

  getModelContainerPath = (
    modelName: keyof typeof subDirectories
  ): string[] => {
    return [...this.getBasePath(), subDirectories.model, modelName];
  };

  getFilePath = (fileId: string): string[] => {
    return [...this.getFileContainerPath(), fileId];
  };

  getFileVersionPath = (fileId: string, fileVersionId: string): string[] => {
    const filePath: string[] = this.getFilePath(fileId);
    return [...filePath, fileVersionId];
  };

  // handler
  handleStringifiedFileVersion = (stringifiedFileVersion: string): void => {
    const fileVersion: FileVersion<string> | null = parseValidObject(
      stringifiedFileVersion,
      FileVersionReference
    );
    if (fileVersion == null) return;

    this.handleFileVersion(fileVersion);
  };

  handleFileVersion = (fileVersion: FileVersion<string>): void => {
    const didStore: boolean = this.storeFileVersion(fileVersion);
    if (didStore == false) return;

    this.taskModel.handleFileVersion(fileVersion);
  };

  // methods
  addFileVersion = (fileVersion: FileVersion<string>): void => {
    this.handleFileVersion(fileVersion);
    this.chatModel.sendMessage("", fileVersion);
  };

  // storage
  storeFileVersion = (fileVersion: FileVersion<string>): boolean => {
    const fileVersionPath: string[] = this.getFileVersionPath(
      fileVersion.fileId,
      fileVersion.fileVersionId
    );

    // check if fileVersion already exists
    const existingFileVersion: string | null =
      this.storageModel.read(fileVersionPath);
    if (existingFileVersion != null) return false;

    const stringifiedContent: string = stringify(fileVersion);
    this.storageModel.write(fileVersionPath, stringifiedContent);
    return true;
  };

  listFileIds = (): string[] => {
    return this.storageModel.list(this.getBasePath());
  };

  listFileVersionIds = (fileId: string): string[] => {
    const filePath: string[] = this.getFilePath(fileId);
    return this.storageModel.list(filePath);
  };

  selectLatestFileVersionId = (
    fileVersionIds: string[]
  ): string | undefined => {
    return fileVersionIds[fileVersionIds.length - 1];
  };

  getFileVersion = <T extends FileVersion<string>>(
    fileId: string,
    fileVersionName: string,
    reference: T
  ): T | null => {
    const filePath: string[] = this.getFileVersionPath(fileId, fileVersionName);
    const fileVersionOrNull: T | null = this.storageModel.readStringifiable(
      filePath,
      reference
    );
    return fileVersionOrNull;
  };

  getLatestFileVersion = <T extends FileVersion<string>>(
    fileId: string,
    reference: T
  ): T | null => {
    const fileVersionsIds: string[] = this.listFileVersionIds(fileId);
    const latestFileVersionId: string | undefined =
      this.selectLatestFileVersionId(fileVersionsIds);
    if (latestFileVersionId == undefined) return null;

    const fileVersion: T | null = this.getFileVersion(
      fileId,
      latestFileVersionId,
      reference
    );
    return fileVersion;
  };

  // init
  constructor(chatModel: ChatModel, storageModel: StorageModel) {
    this.chatModel = chatModel;
    this.storageModel = storageModel;

    this.taskModel = new TaskModel(this.storageModel, chatModel, this);

    // DEV
    // this.taskModel.createBoard("Hello");
    // const boards = this.taskModel.listBoardIds();
    // console.log(boards);

    // const boardId = boards[0];

    // const firstBoardInfo = this.taskModel.getBoardInfo(boardId);
    // console.log(firstBoardInfo);

    // const newInfo = TaskModel.createBoardInfoFileVersion(
    //   boardId,
    //   "renamed",
    //   Color.Coral
    // );
    // this.taskModel.createOrUpdateBoard(newInfo);

    // setTimeout(() => this.taskModel.deleteBoard(boardId), 7000);
  }

  // utility
  static generateFileVersionId = (creationDate): string => {
    return creationDate + v4();
  };

  static createFileVersion = <T extends string>(
    fileId: string,
    type: T
  ): FileVersion<T> => {
    const creationDate: string = createTimestamp();
    const fileVersionId: string = FileModel.generateFileVersionId(creationDate);

    return {
      dataVersion: DATA_VERSION,

      fileId,
      fileVersionId,
      creationDate,
      type,
    };
  };
}

// paths
export const subDirectories = {
  data: "data",
  model: "model",
  taskModel: "tasks",
};

// types
export interface FileVersion<T extends string> extends ValidObject {
  fileId: string;
  fileVersionId: string;
  creationDate: string;

  type: T;
}

// references
export const FileVersionReference: FileVersion<string> = {
  dataVersion: DATA_VERSION,

  fileId: "",
  fileVersionId: "",
  creationDate: "",

  type: "",
};
