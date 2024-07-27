// this file is responsible for sending and handling files.

import ConnectionModel from "./connectionModel";
import StorageModel from "./storageModel";
import { generateRandomToken } from "../Utility/utility";

export default class FileTransferModel {
  storageModel: StorageModel;
  connectionModel: ConnectionModel;

  // methods
  generateTransferData = (): TransferData => {
    return {
      channel: generateRandomToken(2),
      key: generateRandomToken(3),
    };
  };

  // init
  constructor(storageModel: StorageModel, connectionModel: ConnectionModel) {
    this.storageModel = storageModel;
    this.connectionModel = connectionModel;
  }
}

export interface TransferData {
  channel: string;
  key: string;
}
