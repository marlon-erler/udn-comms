import * as React from "bloatless-react";

import { Chat, MessageObject, MessageObjectWithIndex } from "../../Model/chatModel";

import { dayInCalendar } from "../../Model/model";
import { getRawObjectIndex } from "../../utility";

export function MiniatureDayView(
  chat: Chat,
  messageObjects:
    | React.ListState<MessageObjectWithIndex>
    | React.MapState<MessageObjectWithIndex>,
  dateObject: Date
) {
  const objectsForDayView = new React.ListState<MessageObject>();

  const dateString = dateObject.toISOString().split("T")[0];

  function processObject(messageObject: MessageObjectWithIndex) {
    const latest = chat.getMostRecentContent(messageObject);
    if (!latest.date || latest.date != dateString) return;

    objectsForDayView.add(messageObject);
    messageObjects.handleRemoval(messageObject, () => {
      objectsForDayView.remove(messageObject);
    });
  }

  function select() {
    dayInCalendar.value = dateString;
  }

  const isSelected = React.createProxyState(
    [dayInCalendar],
    () => dayInCalendar.value == dateString
  );
  const today = new Date();
  const isToday =
    today.getDate() == dateObject.getUTCDate() &&
    today.getMonth() == dateObject.getUTCMonth() &&
    today.getFullYear() == dateObject.getUTCFullYear();

  messageObjects.handleAddition(processObject);

  const objectConverter: React.StateItemConverter<MessageObjectWithIndex> = (
    messageObject
  ) => {
    const view = (
      <span class="secondary ellipsis">
        {chat.getObjectTitle(messageObject)}
      </span>
    );
    messageObject.index.subscribe(newIndex => {
      view.style.order = newIndex;
    })
    return view;
  };

  return (
    <button
      on:click={select}
      toggle:selected={isSelected}
      toggle:today={isToday}
      class="day-miniature tile flex-column align-start"
      style="aspect-ratio: 1/1; overflow: hidden"
    >
      <h3 class="margin-0">{dateObject.getUTCDate()}</h3>
      <div
        class="flex-column gap"
        children:append={[objectsForDayView, objectConverter]}
      ></div>
    </button>
  );
}
