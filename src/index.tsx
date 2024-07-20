import { ConnectionModal } from "./View/Modals/connectionModal";
import ConnectionViewModel from "./ViewModel/connectionViewModel";
import { HomePage } from "./View/homePage";
import SettingsViewModel from "./ViewModel/settingsViewModel";
import StorageModel from "./Model/storageModel";

// models
const storageModel = new StorageModel();
console.log(JSON.stringify(storageModel.storageEntryTree, null, 4));

// viewModels
const settingsViewModel = new SettingsViewModel(storageModel);
const connectionViewModel = new ConnectionViewModel(storageModel);

// view
document
  .querySelector("main")!
  .append(
    HomePage(settingsViewModel, connectionViewModel),
    ConnectionModal(connectionViewModel)
  );
