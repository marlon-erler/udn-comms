import * as React from "bloatless-react";

import FileTransferModel, {
  TransferData,
} from "../../Model/Global/fileTransferModel";
import StorageModel, {
  StorageModelSubPath,
} from "../../Model/Global/storageModel";

import ChatListModel from "../../Model/Chat/chatListModel";
import ChatModel from "../../Model/Chat/chatModel";
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

  transferChannel: React.State<string> = new React.State("");
  transferKey: React.State<string> = new React.State("");

  filesSentCount: React.State<number> = new React.State(0);
  filePathsSent: React.ListState<string> = new React.ListState();
  didNotFinishSending: React.State<boolean> = new React.State(true);
  filesSentText: React.State<string> = React.createProxyState(
    [this.filesSentCount],
    () =>
      translations.dataTransferModal.filesSentCount(this.filesSentCount.value)
  );

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

  getTransferData = (): void => {
    const transferData: TransferData =
      this.fileTransferModel.generateTransferData();
    this.transferChannel.value = transferData.channel;
    this.transferKey.value = transferData.key;
  };

  // view
  showDirectionSelectionModal = (): void => {
    this.presentedModal.value = FileTransferModal.DirectionSelection;
    this.getOptions();
  };

  showFileSelectionModal = (): void => {
    this.presentedModal.value = FileTransferModal.FileSelection;
  };

  showTransferDataModal = (): void => {
    this.presentedModal.value = FileTransferModal.TransferDataDisplay;
    this.getTransferData();
  };

  initiateTransfer = (): void => {
    this.presentedModal.value = FileTransferModal.TransferDisplay;
    this.didNotFinishSending.value = true;
    this.filesSentCount.value = 0;
    this.filePathsSent.clear();

    this.fileTransferModel.sendFiles(
      this.selectedPaths.value.values(),
      (path: string) => {
        console.log(path);
        this.filePathsSent.add(path);
        this.filesSentCount.value++;
      }
    );

    this.didNotFinishSending.value = false;
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
