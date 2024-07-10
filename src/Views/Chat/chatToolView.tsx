import * as React from "bloatless-react";

import { Chat, Item } from "../../Model/chatModel";

import { translation } from "../../translations";

export function ChatToolView(chat: Chat) {
  function createItem() {
    chat.createItem({
      id: React.UUID(),
      title: "new item",
    });
  }

  const itemConverter: React.StateItemConverter<Item> = (item) => {
    return <span>{item.title}</span>;
  };

  return (
    <div class="chat-tool-view">
      <button on:click={createItem}>+</button>
      <hr></hr>
      <div children:append={[chat.items, itemConverter]}></div>
    </div>
  );
}
