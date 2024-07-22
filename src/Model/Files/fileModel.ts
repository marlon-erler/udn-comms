// this file is responsible for managing files within chats.

import { DATA_VERSION, ValidObject } from "../Utility/typeSafety";
import StorageModel, { filePaths } from "../Global/storageModel";
import {
  createTimestamp,
  parseValidObject,
  stringify,
} from "../Utility/utility";

import ChatModel from "../Chat/chatModel";
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

  getFilePath = (fileId: string): string[] => {
    return [...this.getBasePath(), fileId];
  };

  getFileContentPath = (file: File, fileContentName: string): string[] => {
    const filePath: string[] = this.getFilePath(file.id);
    return [...filePath, fileContentName];
  };

  // handler
  handleStringifiedFile = (stringifiedFile: string): void => {
    const file: File | null = parseValidObject(stringifiedFile, FileReference);
    if (file == null) return;

    this.handleFileAndClearContents(file);
  };

  handleFileAndClearContents = (file: File): void => {
    for (const fileContent of file.contentVersions) {
      this.storeFileContent(file, fileContent);
      this.taskModel.handleTaskFileContent(file, fileContent);

      file.contentVersions.delete(fileContent);
    }
  };

  // methods
  addOrUpdateFile = (file: File): void => {
    this.chatModel.sendMessage("", file);
    this.handleFileAndClearContents(file);
  };

  // storage
  storeFileContent = (file: File, fileContent: FileContent<string>): void => {
    const fileContentName: string = FileModel.getFileContentName(fileContent);
    const fileContentPath: string[] = this.getFileContentPath(
      file,
      fileContentName
    );

    // check if fileContent already exists
    const existingFileContent: string | null =
      this.storageModel.read(fileContentPath);
    if (existingFileContent != null) return;

    const stringifiedContent: string = stringify(fileContent);
    this.storageModel.write(fileContentPath, stringifiedContent);
  };

  listFileIds = (): string[] => {
    return this.storageModel.list(this.getBasePath());
  };

  getFile = (fileId: string): File | null => {
    const filePath = this.getFilePath(fileId);
    const fileOrNull: File | null = this.storageModel.readStringifiable(
      filePath,
      FileReference
    );
    return fileOrNull;
  };

  listFileContents = (file: File): string[] => {
    const filePath: string[] = this.getFilePath(file.id);
    return this.storageModel.list(filePath);
  };

  getLatestFileContentName = (fileContentNames: string[]): string | null => {
    return fileContentNames[fileContentNames.length - 1];
  };

  getFileContent = (
    file: File,
    fileContentName: string
  ): FileContent<string> | null => {
    const filePath = this.getFileContentPath(file, fileContentName);
    const fileContentOrNull: FileContent<string> | null =
      this.storageModel.readStringifiable(filePath, FileContentReference);
    return fileContentOrNull;
  };

  // init
  constructor(chatModel: ChatModel, storageModel: StorageModel) {
    this.chatModel = chatModel;
    this.storageModel = storageModel;

    this.taskModel = new TaskModel(chatModel, this);
  }

  // utility
  static getFileContentName = (fileContent: FileContent<string>): string => {
    return fileContent.creationDate + fileContent.id;
  };

  static createFile = (): File => {
    return {
      dataVersion: DATA_VERSION,

      id: v4(),
      contentVersions: new Set(),
    };
  };

  static createFileContent = <T extends string>(type: T): FileContent<T> => {
    return {
      dataVersion: DATA_VERSION,

      id: v4(),
      creationDate: createTimestamp(),
      type,
    };
  };
}

// types
export interface File extends ValidObject {
  id: string;
  contentVersions: Set<FileContent<string>>;
}

export interface FileContent<T extends string> extends ValidObject {
  id: string;
  creationDate: string;

  type: T;
}

// references
export const FileContentReference: FileContent<string> = {
  dataVersion: DATA_VERSION,

  id: "",
  creationDate: "",
  type: "",
};

export const FileReference: File = {
  dataVersion: DATA_VERSION,

  id: "",
  contentVersions: new Set([FileContentReference]),
};
