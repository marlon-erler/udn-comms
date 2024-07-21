import "./base.css";
import "./colors.css";

import ChatListModel from "./Model/chatListModel";
import ChatListViewModel from "./ViewModel/chatListViewModel";
import { ChatPageWrapper } from "./View/chatPageWrapper";
import { ConnectionModal } from "./View/Modals/connectionModal";
import ConnectionModel from "./Model/connectionModel";
import ConnectionViewModel from "./ViewModel/connectionViewModel";
import { HomePage } from "./View/homePage";
import SettingsModel from "./Model/settingsModel";
import SettingsViewModel from "./ViewModel/settingsViewModel";
import { StorageModal } from "./View/Modals/storageModal";
import StorageModel from "./Model/storageModel";
import StorageViewModel from "./ViewModel/storageViewModel";

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
  chatListModel,
  storageModel,
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