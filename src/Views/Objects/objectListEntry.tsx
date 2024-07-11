import * as React from "bloatless-react";

import { MessageObject } from "../../Model/chatModel";

export function ObjectListEntry(
  messageObject: MessageObject,
  onclick: () => void
) {
  return (
    <button class="tile" on:click={onclick}>
      <b>{messageObject.title}</b>
    </button>
  );
}
