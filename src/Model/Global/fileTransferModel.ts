// this file is responsible for sending and handling files.

import ConnectionModel from "./connectionModel";
import StorageModel from "./storageModel";

export default class FileTransferModel {
    storageModel: StorageModel;
    connectionModel: ConnectionModel;

    // init
    constructor(storageModel: StorageModel, connectionModel: ConnectionModel) {
        this.storageModel = storageModel;
        this.connectionModel = connectionModel;
    }
}