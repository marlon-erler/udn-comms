import * as React from "bloatless-react";

import { MessageComposer } from "../Views/messageComposer";
import { ThreadView } from "../Views/threadView";
import { selectedChat } from "../Model/model";
import { translation } from "../translations";

export function MessageTab() {
  function clearMessageHistory() {
    selectedChat.value?.clearMessages();
  }

  const headerText = React.createProxyState([selectedChat], () =>
    selectedChat.value != undefined
      ? selectedChat.value.currentChannel
      : translation.messages
  );

  return (
    <article id="message-tab">
      <header>
        <span subscribe:innerText={headerText}>
        </span>
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
