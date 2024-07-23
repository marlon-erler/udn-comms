// this file is responsible for managing files within chats.

import { DATA_VERSION, ValidObject } from "../Utility/typeSafety";
import {
  HandlerManager,
  createTimestamp,
  parseValidObject,
  stringify,
} from "../Utility/utility";
import StorageModel, { filePaths } from "../Global/storageModel";

import BoardModel from "./boardModel";
import ChatModel from "../Chat/chatModel";
import { v4 } from "uuid";

export default class FileModel {
  chatModel: ChatModel;
  storageModel: StorageModel;

  taskModel: BoardModel;

  fileContentHandlerManager: HandlerManager<FileContent<string>> = new HandlerManager();

  // paths
  getBasePath = (): string[] => {
    return StorageModel.getPath(
      "chat",
      filePaths.chat.files(this.chatModel.id)
    );
  };

  getFileContainerPath = (): string[] => {
    return [...this.getBasePath(), FileModelSubPath.Data];
  };

  getModelContainerPath = (
    modelName: FileModelSubPath
  ): string[] => {
    return [...this.getBasePath(), FileModelSubPath.Model, modelName];
  };

  getFilePath = (fileId: string): string[] => {
    return [...this.getFileContainerPath(), fileId];
  };

  getFileContentPath = (fileId: string, fileContentId: string): string[] => {
    const filePath: string[] = this.getFilePath(fileId);
    return [...filePath, fileContentId];
  };

  // handlers
  handleStringifiedFileContent = (stringifiedFileContent: string): void => {
    const fileContent: FileContent<string> | null = parseValidObject(
      stringifiedFileContent,
      FileContentReference
    );
    if (fileContent == null) return;

    this.handleFileContent(fileContent);
  };

  handleFileContent = (fileContent: FileContent<string>): void => {
    const didStore: boolean = this.storeFileContent(fileContent);
    if (didStore == false) return;

    this.taskModel.handleFileContent(fileContent);
    this.fileContentHandlerManager.trigger(fileContent);
  };

  // methods
  addFileContent = (fileContent: FileContent<string>): void => {
    this.handleFileContent(fileContent);
    this.chatModel.sendMessage("", fileContent);
  };

  // storage
  storeFileContent = (fileContent: FileContent<string>): boolean => {
    const fileContentPath: string[] = this.getFileContentPath(
      fileContent.fileId,
      fileContent.fileContentId
    );

    // check if fileContent already exists
    const existingFileContent: string | null =
      this.storageModel.read(fileContentPath);
    if (existingFileContent != null) return false;

    const stringifiedContent: string = stringify(fileContent);
    this.storageModel.write(fileContentPath, stringifiedContent);
    return true;
  };

  listFileIds = (): string[] => {
    return this.storageModel.list(this.getBasePath());
  };

  listFileContentIds = (fileId: string): string[] => {
    const filePath: string[] = this.getFilePath(fileId);
    return this.storageModel.list(filePath);
  };

  selectLatestFileContentId = (
    fileContentIds: string[]
  ): string | undefined => {
    return fileContentIds[fileContentIds.length - 1];
  };

  getFileContent = <T extends FileContent<string>>(
    fileId: string,
    fileContentName: string,
    reference: T
  ): T | null => {
    const filePath: string[] = this.getFileContentPath(fileId, fileContentName);
    const fileContentOrNull: T | null = this.storageModel.readStringifiable(
      filePath,
      reference
    );
    return fileContentOrNull;
  };

  getLatestFileContent = <T extends FileContent<string>>(
    fileId: string,
    reference: T
  ): T | null => {
    const fileContentsIds: string[] = this.listFileContentIds(fileId);
    const latestFileContentId: string | undefined =
      this.selectLatestFileContentId(fileContentsIds);
    if (latestFileContentId == undefined) return null;

    const fileContent: T | null = this.getFileContent(
      fileId,
      latestFileContentId,
      reference
    );
    return fileContent;
  };
  
  // init
  constructor(chatModel: ChatModel, storageModel: StorageModel) {
    this.chatModel = chatModel;
    this.storageModel = storageModel;

    this.taskModel = new BoardModel(this.storageModel, chatModel, this);
  }

  // utility
  static generateFileContentId = (creationDate): string => {
    return creationDate + v4();
  };

  static createFileContent = <T extends string>(
    fileId: string,
    type: T
  ): FileContent<T> => {
    const creationDate: string = createTimestamp();
    const fileContentId: string = FileModel.generateFileContentId(creationDate);

    return {
      dataVersion: DATA_VERSION,

      fileId,
      fileContentId,
      creationDate,
      type,
    };
  };
}

// paths
export enum FileModelSubPath {
  Data = "data",
  Model = "model",
  ModelView = "view",
  ModelTask = "tasks",
};

// types
export interface FileContent<T extends string> extends ValidObject {
  fileId: string;
  fileContentId: string;
  creationDate: string;

  type: T;
}

// references
export const FileContentReference: FileContent<string> = {
  dataVersion: DATA_VERSION,

  fileId: "",
  fileContentId: "",
  creationDate: "",

  type: "",
};
