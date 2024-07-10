import * as React from "bloatless-react";

import { Chat } from "../Model/chatModel";
import { translation } from "../translations";

export function ChatToolView(chat: Chat) {
  function createItem() {
    chat.createItem({
      id: React.UUID(),
      title: "new item",
    });
  }

  return (
    <div class="chat-tool-view">
      <button on:click={createItem}>+</button>
      <hr></hr>
      
    </div>
  );
}
