import * as React from "bloatless-react";

import { cannotSendMessage, messageBody, sendMessage } from "../model";

import { translation } from "../translations";

export function MessageComposer() {
  return (
    <div class="flex-row width-100">
      <input
        class="width-100 flex-1"
        style="max-width: unset"
        placeholder={translation.composerPlaceholder}
        bind:value={messageBody}
        on:enter={sendMessage}
      ></input>
      <button
        class="primary"
        on:click={sendMessage}
        toggle:disabled={cannotSendMessage}
      >
        <span class="icon">send</span>
      </button>
    </div>
  );
}
