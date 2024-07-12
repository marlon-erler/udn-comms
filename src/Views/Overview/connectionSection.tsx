import * as React from "bloatless-react";

import {
  cannotConnect,
  cannotDeleteMailbox,
  cannotDisonnect,
  cannotRequestMailbox,
  cannotResetAddress,
  connect,
  deleteMailbox,
  disconnect,
  outboxText,
  outboxTextStyle,
  previousAddresses,
  requestMailbox,
  resetAddressInput,
  serverAddressInput,
} from "../../Model/model";

import { stringToOptionTag } from "../../utility";
import { translation } from "../../translations";

export function ConnectionSection() {
  const stringToPreviouAddressOption: React.StateItemConverter<string> = (
    value
  ) => {
    const isSelected = value == serverAddressInput.value;
    return <option toggle:selected={isSelected}>{value}</option>;
  };

  return (
    <div class="flex-column">
      <h2>{translation.connection}</h2>

      <label class="tile">
        <span class="icon">cell_tower</span>
        <div>
          <span>{translation.serverAddress}</span>
          <input
            bind:value={serverAddressInput}
            on:enter={connect}
            placeholder={translation.serverAddressPlaceholder}
            list="previous-addresses"
          ></input>
          <datalist
            hidden
            id="previous-addresses"
            children:append={[previousAddresses, stringToOptionTag]}
          ></datalist>
        </div>
      </label>
      <label class="tile">
        <span class="icon">history</span>
        <div>
          <span>{translation.previousConnections}</span>
          <select
            bind:value={serverAddressInput}
            children:append={[previousAddresses, stringToPreviouAddressOption]}
          ></select>
          <span class="icon">arrow_drop_down</span>
        </div>
      </label>
      <div class="flex-row width-input justify-end">
        <button
          class="danger width-100 flex-1 justify-center"
          aria-label={translation.disconnect}
          on:click={disconnect}
          toggle:disabled={cannotDisonnect}
        >
          <span class="icon">close</span>
        </button>
        <button
          class="width-100 flex-1 justify-center"
          aria-label={translation.undoChanges}
          on:click={resetAddressInput}
          toggle:disabled={cannotResetAddress}
        >
          <span class="icon">undo</span>
        </button>
        <button
          class="primary width-100 flex-1 justify-center"
          aria-label={translation.connectToServer}
          on:click={connect}
          toggle:disabled={cannotConnect}
        >
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
          class="danger width-100 flex-1"
          on:click={deleteMailbox}
          toggle:disabled={cannotDeleteMailbox}
        >
          {translation.deleteMailbox}
        </button>
        <button
          class="primary width-100 flex-1"
          on:click={requestMailbox}
          toggle:disabled={cannotRequestMailbox}
        >
          {translation.requestMailbox}
          <span class="icon">arrow_forward</span>
        </button>
      </div>

      <hr></hr>

      <div class="tile">
        <span class="icon">outbox</span>
        <div>
          <b>{translation.outbox}</b>
          <span
            set:class={outboxTextStyle}
            subscribe:innerText={outboxText}
          ></span>
        </div>
      </div>
    </div>
  );
}
