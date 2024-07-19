import ConnectionModel from "./Model/connectionModel";
import StorageModel from "./Model/storageModel";

const storageModel = new StorageModel();
const connectionModel = new ConnectionModel({
    connectionChangeHandler() {
        
    },
    messageHandler(data) {
        
    },
})