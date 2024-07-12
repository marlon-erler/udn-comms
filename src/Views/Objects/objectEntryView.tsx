import * as React from "bloatless-react";

import {
  Chat,
  MessageObject,
  MessageObjectContent,
} from "../../Model/chatModel";

import { icons } from "../../icons";

export function ObjectEntryView(
  chat: Chat,
  messageObject: MessageObject,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const latest = chat.getMostRecentContent(messageObject);

  function select() {
    selectedObject.value = messageObject;
    isShowingObjectModal.value = true;
  }

  function dragStart(event: DragEvent) {
    event.dataTransfer?.setData("text", messageObject.id);
  }

  const fields = {
    [icons.noteContent]: "---",
    [icons.priority]: "---",
    [icons.status]: "---",
    [icons.date]: "---",
    [icons.time]: "---",
  };
  Object.entries(latest).forEach((entry) => {
    let [key, value] = entry as [keyof MessageObjectContent, string];
    if (!value) return;

    const icon = icons[key];
    if (!icon) return;

    if (!fields[icon]) return;
    fields[icon] = value;
  });

  const fieldElements = Object.entries(fields).map((field) => {
    const [icon, value] = field;
    return (
      <span class="flex-row control-gap align-center">
        <span class="icon">{icon}</span>
        <span class="ellipsis">{value}</span>
      </span>
    );
  });

  return (
    <button
      class="tile flex-no"
      on:click={select}
      draggable="true"
      on:dragstart={dragStart}
    >
      <div>
        <b class="ellipsis">{chat.getObjectTitle(messageObject)}</b>
        <hr></hr>
        <span class="flex-column gap height-100 flex secondary ellipsis ">
          {...fieldElements}
        </span>
      </div>
    </button>
  );
}
