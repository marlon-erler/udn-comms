import ConnectionViewModel from "./ViewModel/connectionViewModel";
import { HomePage } from "./View/homePage";
import SettingsViewModel from "./ViewModel/settingsViewModel";
import StorageModel from "./Model/storageModel";

// models
const storageModel = new StorageModel();

// viewModels
const settingsViewModel = new SettingsViewModel(storageModel);
const connectionViewModel = new ConnectionViewModel();

// view
document
  .querySelector("main")!
  .append(HomePage(settingsViewModel, connectionViewModel));
