import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { dayInCalendar } from "../../Model/model";

export function DayView(
  chat: Chat,
  messageObjects:
    | React.ListState<MessageObject>
    | React.MapState<MessageObject>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const objectsForDayView = new React.ListState<MessageObject>();

  function processObject(messageObject: MessageObject) {
    const latest = chat.getMostRecentContent(messageObject);
    if (!latest.date || latest.date != dayInCalendar.value) return;

    objectsForDayView.add(messageObject);
    messageObjects.handleRemoval(messageObject, () => {
      objectsForDayView.remove(messageObject);
    })
  }

  messageObjects.handleAddition(processObject);
  dayInCalendar.subscribeSilent(() => {
    objectsForDayView.clear();
    chat.objects.value.forEach(processObject);
  })

  const objectConverter: React.StateItemConverter<MessageObject> = (
    messageObject
  ) => {
    const latest = chat.getMostRecentContent(messageObject);
    const timeString = latest.time ?? "00:00";
    const [hour, minute] = timeString.split(":");
    const hourInMinutes = parseInt(hour) * 60;
    const minutesTotal = parseInt(minute) + hourInMinutes;

    const view = ObjectEntryView(
      chat,
      messageObject,
      selectedObject,
      isShowingObjectModal
    );
    view.style.order = minutesTotal;
    return view;
  };

  return (
    <div
      class="day-view padding flex-column gap"
      children:prepend={[objectsForDayView, objectConverter]}
    ></div>
  );
}
