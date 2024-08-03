import "./base.css";
import "./colors.css";
import "./coloredTile.css";

import * as React from "bloatless-react";

import WindowManager, { Window } from "./WindowManager/windowManager";

import ChatListModel from "./Model/Chat/chatListModel";
import ChatListViewModel from "./ViewModel/Chat/chatListViewModel";
import ConnectionModel from "./Model/Global/connectionModel";
import ConnectionViewModel from "./ViewModel/Global/connectionViewModel";
import CoreViewModel from "./ViewModel/Global/coreViewModel";
import FileTransferModel from "./Model/Global/fileTransferModel";
import FileTransferViewModel from "./ViewModel/Global/fileTransferViewModel";
import SettingsModel from "./Model/Global/settingsModel";
import SettingsViewModel from "./ViewModel/Global/settingsViewModel";
import StorageModel from "./Model/Global/storageModel";
import StorageViewModel from "./ViewModel/Global/storageViewModel";
import { showWindow } from "./WindowManager/windowView";
import v1Upgrader from "./Upgrader/v1";

// models
const storageModel = new StorageModel();
const settingsModel = new SettingsModel(storageModel);
const connectionModel = new ConnectionModel(storageModel);
const chatListModel = new ChatListModel(
  storageModel,
  settingsModel,
  connectionModel
);
const fileTransferModel = new FileTransferModel(storageModel, connectionModel);

// upgrade
new v1Upgrader(settingsModel, connectionModel, chatListModel);

// viewModels
const coreVieWModel = new CoreViewModel();

const storageViewModel = new StorageViewModel(coreVieWModel, storageModel);
const settingsViewModel = new SettingsViewModel(coreVieWModel, settingsModel);
const connectionViewModel = new ConnectionViewModel(
  coreVieWModel,
  connectionModel
);
const chatListViewModel = new ChatListViewModel(
  coreVieWModel,
  storageModel,
  chatListModel,
  settingsViewModel
);
const fileTransferViewModel = new FileTransferViewModel(
  fileTransferModel,
  chatListModel
);

// windows
const root = (
  <div>
    <button class="primary" on:click={openWindow}>+</button>
  </div>
);
const windowManager = new WindowManager(root);

function openWindow() {
  showWindow(new React.State("Untitled"), windowManager);
}

document.body.append(
  <div id="background-wrapper">
    <div id="sky"></div>
    <div id="grass-1"></div>
    <div id="grass-2"></div>
  </div>
);
document.body.append(root);
