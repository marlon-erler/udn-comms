import * as React from 'bloatless-react';

import ConnectionModel from '../Model/connectionModel';

// model
const connectionModel = new ConnectionModel();

// state
const address = new React.State("");

// methods
function connect() {
    connectionModel.connect(address.value);
}

function disconnect() {
    connectionModel.disconnect();
}

// view
document.querySelector("main")!.append(
    <div class="flex-column">
        <input bind:value={address}></input>
        <button on:click={connect}>Connect</button>
        <button on:click={disconnect}>Disconnect</button>
    </div>
)