import * as React from "bloatless-react";

import { closeChatView, selectedChat } from "../Model/model";

import { MessageComposer } from "../Views/messageComposer";
import { ThreadView } from "../Views/threadView";
import { translation } from "../translations";

export function MessageTab() {
  const messageTabContent = React.createProxyState([selectedChat], () => {
    if (selectedChat.value == undefined)
      return (
        <div class="width-100 height-100 flex-column align-center justify-center">
          <span class="secondary">{translation.noChatSelected}</span>
        </div>
      );

    const chat = selectedChat.value;

    function clearMessageHistory() {
      chat.clearMessages();
    }

    return (
      <article id="message-tab">
        <header class="padding-0">
          <span class="flex-row align-center">
            <button aria-label={translation.back} on:click={closeChatView}>
              <span class="icon">arrow_back</span>
            </button>

            <span subscribe:innerText={chat.currentChannel}></span>
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
        {ThreadView(chat)}
        <footer>{MessageComposer(chat)}</footer>
      </article>
    );
  });

  return <div children:set={messageTabContent}></div>;
}
