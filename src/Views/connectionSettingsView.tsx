import * as React from "bloatless-react";

import {
  cannotConnect,
  cannotDeleteMailbox,
  cannotDisonnect,
  cannotRequestMailbox,
  connect,
  deleteMailbox,
  disconnect,
  requestMailbox,
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

      <hr></hr>

      <div class="tile">
        <span class="icon">inbox</span>
        <div>
          <b>{translation.mailbox}</b>
          <span class="secondary">{translation.mailboxExplanation}</span>
        </div>
      </div>
      <div class="flex-row width-input justify-end">
        <button
          class="danger width-50"
          on:click={deleteMailbox}
          toggle:disabled={cannotDeleteMailbox}
        >
          {translation.deleteMailbox}
        </button>
        <button
          class="primary width-50"
          on:click={requestMailbox}
          toggle:disabled={cannotRequestMailbox}
        >
          {translation.requestMailbox}
          <span class="icon">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
