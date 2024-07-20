import ChatListModel from "./Model/chatListModel";
import ChatListViewModel from "./ViewModel/chatListViewModel";
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
document
  .querySelector("main")!
  .append(
    HomePage(settingsViewModel, connectionViewModel, chatListViewModel),
    ConnectionModal(connectionViewModel)
  );
