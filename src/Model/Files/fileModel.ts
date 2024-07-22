// this file is responsible for managing files within chats.

import { DATA_VERSION, ValidObject } from "../Utility/typeSafety";
import StorageModel, { storageKeys } from "../Global/storageModel";
import { parseValidObject, stringify } from "../Utility/utility";

import ChatModel from "../Chat/chatModel";
import { v4 } from "uuid";

export default class FileModel {
  chatModel: ChatModel;
  storageModel: StorageModel;

  // handler
  handleStringifiedFile = (stringifiedFile: string): void => {
    const file: File | null = parseValidObject(stringifiedFile, FileReference);
    if (file == null) return;

    this.storeFile(file);
  };

  // methods
  addFile = (file: File): void => {
    this.chatModel.sendMessage("", file);
  };

  // storage
  storeFile = (file: File): void => {
    for (const fileContent of file.contentVersions) {
      this.storeFileContent(file, fileContent);
    }
  };

  storeFileContent = (file: File, fileContent: FileContent): void => {
    const fileContentName: string = FileModel.getFileContentName(fileContent);
    const fileContentPath: string[] = FileModel.getFileContentPath(
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
    return this.storageModel.list(storageKeys.chatFiles);
  };

  listFileContents = (file: File): string[] => {
    const filePath: string[] = FileModel.getFilePath(file.id);
    return this.storageModel.list(filePath);
  };

  getFile = (fileId: string): File | null => {
    const filePath = FileModel.getFilePath(fileId);
    const fileOrNull: File | null = this.storageModel.readStringifiable(
      filePath,
      FileReference
    );
    return fileOrNull;
  };

  getLatestFileContentName = (fileContentNames: string[]): string | null => {
    return fileContentNames[fileContentNames.length - 1];
  };

  getFileContent = (
    file: File,
    fileContentName: string
  ): FileContent | null => {
    const filePath = FileModel.getFileContentPath(file, fileContentName);
    const fileContentOrNull: FileContent | null =
      this.storageModel.readStringifiable(filePath, FileContentReference);
    return fileContentOrNull;
  };

  // init
  constructor(chatModel: ChatModel, storageModel: StorageModel) {
    this.chatModel = chatModel;
    this.storageModel = storageModel;
  }

  // utility
  static getFilePath = (fileId: string): string[] => {
    return [...storageKeys.chatFiles, fileId];
  };

  static getFileContentName = (fileContent: FileContent): string => {
    return fileContent.creationDate + fileContent.id;
  };

  static getFileContentPath = (
    file: File,
    fileContentName: string
  ): string[] => {
    const filePath: string[] = FileModel.getFilePath(file.id);
    return [...filePath, fileContentName];
  };

  static createFile = (): File => {
    return {
      dataVersion: DATA_VERSION,

      id: v4(),
      contentVersions: [],
    };
  };
}

// types
export interface File extends ValidObject {
  id: string;
  contentVersions: FileContent[];
}

export interface FileContent extends ValidObject {
  id: string;
  creationDate: string;

  type: string;
}

// references
export const FileContentReference: FileContent = {
  dataVersion: DATA_VERSION,

  id: "",
  creationDate: "",

  type: "",
};

export const FileReference: File = {
  dataVersion: DATA_VERSION,

  id: "",
  contentVersions: [FileContentReference],
};
