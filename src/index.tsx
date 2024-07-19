import ConnectionModel from "./Model/connectionModel";
import { HomePage } from "./View/homePage";
import { MainPage } from "./View/mainPage";
import StorageModel from "./Model/storageModel";

// models
const storageModel = new StorageModel();
const connectionModel = new ConnectionModel({
  connectionChangeHandler() {},
  messageHandler(data) {},
});

// view
document
  .querySelector("main")!
  .append(HomePage());
