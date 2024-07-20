import ConnectionModel from "./Model/connectionModel";
import { HomePage } from "./View/homePage";
import { MainPage } from "./View/mainPage";
import SettingsModel from "./Model/settingsModel";
import SettingsViewModel from "./ViewModel/settingsViewModel";
import StorageModel from "./Model/storageModel";

// models
const storageModel = new StorageModel();
const settingsModel = new SettingsModel(storageModel);
const connectionModel = new ConnectionModel({
  connectionChangeHandler() {},
  messageHandler(data) {},
});

// viewModels
const settingsViewModel = new SettingsViewModel(settingsModel);

// view
document.querySelector("main")!.append(HomePage(settingsViewModel));
