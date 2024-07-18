import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { dayInCalendar } from "../../Model/model";

export function MiniatureDayView(
  chat: Chat,
  messageObjects:
    | React.ListState<MessageObject>
    | React.MapState<MessageObject>,
  dayToShow: Date
) {
  const objectsForDayView = new React.ListState<MessageObject>();

  const dateString = dayToShow.toISOString().split("T")[0];

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

  messageObjects.handleAddition(processObject);

  const objectConverter: React.StateItemConverter<MessageObject> = (
    messageObject
  ) => {
    const latest = chat.getMostRecentContent(messageObject);
    const timeString = latest.time ?? "00:00";
    const [hour, minute] = timeString.split(":");
    const hourInMinutes = parseInt(hour) * 60;
    const minutesTotal = parseInt(minute) + hourInMinutes;

    const view = <b class="ellipsis">{chat.getObjectTitle(messageObject)}</b>;
    view.style.order = minutesTotal;
    return view;
  };

  return (
    <button
      on:click={select}
      toggle:selected={isSelected}
      class="tile flex-column align-start"
    >
      <h3>{dayToShow.getDate()}</h3>
      <div
        class="flex-column gap"
        children:append={[objectsForDayView, objectConverter]}
      ></div>
    </button>
  );
}
