import * as React from "bloatless-react";

import { Chat } from "../Model/chatModel";
import { selectedChat } from "../Model/model";
import { translation } from "../translations";

export function MessageComposer() {
  const composerContent = React.createProxyState([selectedChat], () => {
    if (selectedChat.value == undefined) return <div></div>;

    const chat = selectedChat.value;
    return (
      <div class="flex-row width-100">
        {" "}
        <input
          class="width-100 flex-1"
          style="max-width: unset"
          placeholder={translation.composerPlaceholder}
          bind:value={chat.composingMessage}
          on:enter={chat.sendMessage}
        ></input>
        <button
          class="primary"
          on:click={chat.sendMessage}
          toggle:disabled={chat.cannotSendMessage}
        >
          <span class="icon">send</span>
        </button>
      </div>
    );
  });

  return <div children:set={composerContent}></div>;
}
