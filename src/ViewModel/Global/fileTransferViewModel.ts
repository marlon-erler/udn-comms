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
  presentedModal: React.State<FileTransferModal | undefined> =
    new React.State<any>(undefined);

  generalFileOptions: React.ListState<FileTransferOption> =
    new React.ListState();
  chatFileOptions: React.ListState<FileTransferOption> = new React.ListState();
  selectedPaths: React.ListState<string[]> = new React.ListState();

  // guards
  hasNoPathsSelected: React.State<boolean> = React.createProxyState(
    [this.selectedPaths],
    () => this.selectedPaths.value.size == 0
  );

  // methods
  getOptions = (): void => {
    this.generalFileOptions.clear();
    this.chatFileOptions.clear();

    this.generalFileOptions.add(
      {
        label: translations.dataTransferModal.connectionData,
        path: StorageModel.getPath(StorageModelSubPath.ConnectionModel, []),
      },
      {
        label: translations.dataTransferModal.settingsData,
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
  showDirectionSelectionModal = (): void => {
    this.presentedModal.value = FileTransferModal.DirectionSelection;
  };

  showFileSelectionModal = (): void => {
    this.presentedModal.value = FileTransferModal.FileSelection;
    this.getOptions();
  };

  hideModal = (): void => {
    this.presentedModal.value = undefined;
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

export enum FileTransferModal {
  DirectionSelection,

  // sending
  FileSelection,
  TransferDataDisplay,
  TransferDisplay,

  // receiving
  TransferDataInput,
  ReceptionDisplay,
}
