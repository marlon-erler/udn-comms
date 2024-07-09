import * as React from "bloatless-react";

import { Chat, chats, removeChat } from "../Model/chatModel";
import { cannotCreateChat, createChat, newChatName } from "../Model/model";

import { translation } from "../translations";

const chatConverter: React.ListItemConverter<Chat> = (chat) => {
  function remove() {
    removeChat(chat);
  }

  return (
    <div class="tile padding-0">
      <div class="flex-row width-100 justify-apart align-center">
        <span class="padding-h ellipsis" subscribe:innerText={chat.currentChannel}></span>
        
        <button
          class="danger"
          aria-label={translation.removeChat}
          on:click={remove}
        >
          <span class="icon">delete</span>
        </button>
      </div>
    </div>
  );
};

export function ChatListSection() {
  return (
    <div class="flex-column">
      <h2>{translation.chats}</h2>

      <label class="tile">
        <span class="icon">forum</span>
        <div>
          <span>{translation.newChatPrimaryChannel}</span>
          <input
            bind:value={newChatName}
            placeholder={translation.newChatNamePlaceholder}
            on:enter={createChat}
          ></input>
        </div>
      </label>
      <div class="flex-row justify-end">
        <button
          class="primary width-50"
          toggle:disabled={cannotCreateChat}
          on:click={createChat}
        >
          {translation.addChat}
          <span class="icon">add</span>
        </button>
      </div>

      <hr></hr>

      <div class="flex-column gap" children:append={[chats, chatConverter]}></div>
    </div>
  );
}
