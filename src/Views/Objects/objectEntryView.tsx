import * as React from "bloatless-react";

import {
  Chat,
  MessageObject,
  MessageObjectContent,
  MessageObjectWithIndex,
} from "../../Model/chatModel";

import { icons } from "../../icons";

export function ObjectEntryView(
  chat: Chat,
  messageObject: MessageObjectWithIndex,
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
    [icons.categoryName]: "---",
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
      <span class="flex-row control-gap flex align-center padding-right ellipsis">
        <span class="icon">{icon}</span>
        <span class="ellipsis">{value}</span>
      </span>
    );
  });

  const view = (
    <button
      class="tile flex-no"
      on:click={select}
      draggable="true"
      on:dragstart={dragStart}
    >
      <div>
        <b class="ellipsis">{chat.getObjectTitle(messageObject)}</b>
        <hr></hr>
        <span
          class="grid height-100 flex secondary"
          style="grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1.7rem)"
        >
          {...fieldElements}
        </span>
      </div>
    </button>
  );
  messageObject.index.subscribe(newIndex => {
    view.style.order = newIndex;
  })
  return view;
}
