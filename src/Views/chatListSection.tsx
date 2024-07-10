import * as React from "bloatless-react";

import {
  cannotCreateChat,
  chats,
  createChat,
  newChatName,
  selectChat,
  selectedChat,
} from "../Model/model";

import { Chat } from "../Model/chatModel";
import { translation } from "../translations";

const chatConverter: React.StateItemConverter<Chat> = (chat) => {
  function select() {
    selectChat(chat);
  }

  const isSelected = React.createProxyState(
    [selectedChat],
    () => selectedChat.value == chat
  );

  return (
    <button
      class="tile"
      on:click={select}
      toggle:selected={isSelected}
      toggle:unread={chat.hasUnreadMessages}
    >
      <div>
        <b class="ellipsis" subscribe:innerText={chat.primaryChannel}></b>
      </div>
      <span class="icon">arrow_forward</span>
    </button>
  );
};

export function ChatListSection() {
  return (
    <div class="flex-column">
      <h2>{translation.chats}</h2>

      <label class="tile">
        <span class="icon">forum</span>
        <div>
          <span>{translation.primaryChannel}</span>
          <input
            bind:value={newChatName}
            placeholder={translation.primaryChannelPlaceholder}
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

      <div
        class="flex-column gap"
        children:append={[chats, chatConverter]}
      ></div>
    </div>
  );
}
