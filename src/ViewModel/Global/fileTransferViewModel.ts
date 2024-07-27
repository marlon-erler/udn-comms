import * as React from "bloatless-react";

import StorageModel, {
  StorageModelSubPath,
} from "../../Model/Global/storageModel";

import ChatListModel from "../../Model/Chat/chatListModel";
import ChatModel from "../../Model/Chat/chatModel";
import FileTransferModel from "../../Model/Global/fileTransferModel";
import { translations } from "../../View/translations";

export default class FileTransferViewModel {
  fileTransferModel: FileTransferModel;
  chatListModel: ChatListModel;

  // state
  isShowingTransferModal: React.State<boolean> = new React.State(false);

  generalFileOptions: React.ListState<FileTransferOption> =
    new React.ListState();
  chatFileOptions: React.ListState<FileTransferOption> = new React.ListState();
  selectedPaths: React.ListState<string[]> = new React.ListState();

  // methods
  getOptions = (): void => {
    this.generalFileOptions.clear();
    this.chatFileOptions.clear();

    this.generalFileOptions.add(
      {
        label: translations.fileTransferModal.connectionData,
        path: StorageModel.getPath(StorageModelSubPath.ConnectionModel, []),
      },
      {
        label: translations.fileTransferModal.settingsData,
        path: StorageModel.getPath(StorageModelSubPath.SettingsModel, []),
      }
    );

    const chatModels: Set<ChatModel> = this.chatListModel.chatModels;
    for (const chatModel of chatModels) {
      this.chatFileOptions.add({
        label: chatModel.info.primaryChannel,
        path: chatModel.getBasePath(),
      });
    }
  };

  // view
  showTransferModal = (): void => {
    this.isShowingTransferModal.value = true;
    this.getOptions();
  };

  hideTransferModal = (): void => {
    this.isShowingTransferModal.value = false;
  };

  // init
  constructor(
    fileTransferModel: FileTransferModel,
    chatListModel: ChatListModel
  ) {
    this.fileTransferModel = fileTransferModel;
    this.chatListModel = chatListModel;
  }
}

export interface FileTransferOption {
  label: string;
  path: string[];
}
