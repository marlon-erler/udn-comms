import * as React from "bloatless-react";

import { MessageComposer } from "../Views/messageComposer";
import { ThreadView } from "../Views/threadView";
import { clearMessageHistory } from "../model";
import { translation } from "../translations";

export function MessageTab() {
  return (
    <article id="message-tab">
      <header>
        {translation.messages}
        <span>
          <button
            aria-label={translation.clearHistory}
            on:click={clearMessageHistory}
          >
            <span class="icon">delete_sweep</span>
          </button>
        </span>
      </header>
      {ThreadView()}
      <footer>{MessageComposer()}</footer>
    </article>
  );
}
