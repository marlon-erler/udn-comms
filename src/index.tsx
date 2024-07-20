import "./base.css";

import * as React from "bloatless-react";

import ChatListViewModel from "./ViewModel/chatListViewModel";
import { ChatPageWrapper } from "./View/chatPageWrapper";
import { ConnectionModal } from "./View/Modals/connectionModal";
import ConnectionViewModel from "./ViewModel/connectionViewModel";
import { HomePage } from "./View/homePage";
import SettingsViewModel from "./ViewModel/settingsViewModel";
import StorageModel from "./Model/storageModel";

// models
const storageModel = new StorageModel();
storageModel.print();

// viewModels
const settingsViewModel = new SettingsViewModel(storageModel);
const connectionViewModel = new ConnectionViewModel(storageModel);
const chatListViewModel = new ChatListViewModel(storageModel);

// view
document.body.append(<div id="background"></div>);
document
  .querySelector("main")!
  .append(
    HomePage(settingsViewModel, connectionViewModel, chatListViewModel),
    ChatPageWrapper(chatListViewModel),
    ConnectionModal(connectionViewModel)
  );
