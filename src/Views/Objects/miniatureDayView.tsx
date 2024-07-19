import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { dayInCalendar } from "../../Model/model";

export function MiniatureDayView(
  chat: Chat,
  messageObjects:
    | React.ListState<MessageObject>
    | React.MapState<MessageObject>,
  dateObject: Date
) {
  const objectsForDayView = new React.ListState<MessageObject>();

  const dateString = dateObject.toISOString().split("T")[0];

  function processObject(messageObject: MessageObject) {
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

  const objectConverter: React.StateItemConverter<MessageObject> = (
    messageObject
  ) => {
    const latest = chat.getMostRecentContent(messageObject);
    const timeString = latest.time || "00:00";
    const [hour, minute] = timeString.split(":");
    const hourInMinutes = parseInt(hour) * 60;
    const minutesTotal = parseInt(minute) + hourInMinutes;
    const priority = latest.priority ?? 0;
    const priorityInverse = 100 - priority;
    const order = `${minutesTotal}${priorityInverse}`;

    const view = (
      <span class="secondary ellipsis">
        {chat.getObjectTitle(messageObject)}
      </span>
    );
    view.style.order = order;
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
