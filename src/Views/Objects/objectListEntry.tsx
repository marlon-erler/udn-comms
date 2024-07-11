import * as React from "bloatless-react";

import { MessageObject } from "../../Model/chatModel";

export function ObjectListEntry(
  messageObject: MessageObject,
  onclick: () => void
) {
  return (
    <button class="tile" on:click={onclick}>
      <div>
        <b>{messageObject.title}</b>
        <span class="secondary">{messageObject.id}</span>
      </div>
    </button>
  );
}
