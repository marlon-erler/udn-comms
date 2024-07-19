import * as React from "bloatless-react";

import ConnectionModel from "../Model/connectionModel";

// state
const addressInput = React.restoreState("maintenance-address", "");
const connectedAddress = new React.State("");
const isConnected = new React.State(false);

// model
const connectionModel = new ConnectionModel({
  connectionChangeHandler() {
    isConnected.value = connectionModel.isConnected;
    connectedAddress.value = connectionModel.address ?? "---";
  },
  messageHandler(data) {
    console.log(data);
  },
});

// methods
function connect() {
  connectionModel.connect(addressInput.value);
}

function disconnect() {
  connectionModel.disconnect();
}

// view
document.querySelector("main")!.append(
  <div class="flex-column">
    <input bind:value={addressInput}></input>
    <button on:click={connect} toggle:disabled={isConnected}>
      Connect
    </button>
    <button on:click={disconnect}>Disconnect</button>

    <hr></hr>

    <span subscribe:innerText={connectedAddress}></span>
  </div>
);
