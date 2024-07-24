import "./base.css";
import "./colors.css";
import "./coloredTile.css";

import * as React from "bloatless-react";

import ChatListModel from "./Model/Chat/chatListModel";
import ChatListViewModel from "./ViewModel/Chat/chatListViewModel";
import { ChatPageWrapper } from "./View/chatPageWrapper";
import { ConnectionModal } from "./View/Modals/connectionModal";
import ConnectionModel from "./Model/Global/connectionModel";
import ConnectionViewModel from "./ViewModel/Global/connectionViewModel";
import { HomePage } from "./View/homePage";
import SettingsModel from "./Model/Global/settingsModel";
import SettingsViewModel from "./ViewModel/Global/settingsViewModel";
import { StorageModal } from "./View/Modals/storageModal";
import StorageModel from "./Model/Global/storageModel";
import StorageViewModel from "./ViewModel/Global/storageViewModel";
import { filterObjectsByStringEntries } from "./Model/Utility/utility";

// models
const storageModel = new StorageModel();
const settingsModel = new SettingsModel(storageModel);
const connectionModel = new ConnectionModel(storageModel);
const chatListModel = new ChatListModel(
  storageModel,
  settingsModel,
  connectionModel
);

// viewModels
const storageViewModel = new StorageViewModel(storageModel);
const settingsViewModel = new SettingsViewModel(settingsModel);
const connectionViewModel = new ConnectionViewModel(connectionModel);
const chatListViewModel = new ChatListViewModel(
  storageModel,
  chatListModel,
  settingsViewModel
);

// view
chatListViewModel.selectedChat.subscribe(() => {
  document.body.toggleAttribute(
    "showing-chat",
    chatListViewModel.selectedChat.value != undefined
  );
});

document.body.append(
  <div id="background-wrapper">
    <div id="sky"></div>
    <div id="grass-1"></div>
    <div id="grass-2"></div>
  </div>
);
document
  .querySelector("main")!
  .append(
    HomePage(
      storageViewModel,
      settingsViewModel,
      connectionViewModel,
      chatListViewModel
    ),
    ChatPageWrapper(chatListViewModel),
    ConnectionModal(connectionViewModel),
    StorageModal(storageViewModel)
  );
