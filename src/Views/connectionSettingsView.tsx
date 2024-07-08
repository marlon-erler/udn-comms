import * as React from "bloatless-react";

import {
  cannotConnect,
  cannotDisonnect,
  connect,
  disconnect,
  serverAddress,
} from "../model";

import { translation } from "../translations";

export function ConnectionInputView() {
  return (
    <div class="flex-column">
      <label class="tile">
        <span class="icon">cell_tower</span>
        <div>
          <span>{translation.serverAddress}</span>
          <input
            bind:value={serverAddress}
            on:enter={connect}
            placeholder={translation.serverAddressPlaceholder}
          ></input>
        </div>
      </label>
      <div class="flex-row width-input justify-end">
        <button
          class="danger width-50"
          on:click={disconnect}
          toggle:disabled={cannotDisonnect}
        >
          {translation.disconnect}
        </button>
        <button
          class="primary width-50"
          on:click={connect}
          toggle:disabled={cannotConnect}
        >
          {translation.connectToServer}
          <span class="icon">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
