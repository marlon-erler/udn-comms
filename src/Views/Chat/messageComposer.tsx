import * as React from "bloatless-react";

import { Chat } from "../../Model/chatModel";
import { translation } from "../../translations";

export function MessageComposer(chat: Chat) {
  return (
    <div class="flex-row width-100">
      {" "}
      <input
        class="width-100 flex-1"
        style="max-width: unset"
        placeholder={translation.composerPlaceholder}
        bind:value={chat.composingMessage}
        on:enter={chat.sendMessageFromComposer}
      ></input>
      <button
        class="primary"
        on:click={chat.sendMessageFromComposer}
        toggle:disabled={chat.cannotSendMessage}
      >
        <span class="icon">send</span>
      </button>
    </div>
  );
}
