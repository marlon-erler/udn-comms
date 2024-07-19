import * as React from "bloatless-react";

import { Chat, MessageObject, MessageObjectWithIndex } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { dayInCalendar } from "../../Model/model";

export function DayView(
  chat: Chat,
  messageObjects:
    | React.ListState<MessageObjectWithIndex>
    | React.MapState<MessageObjectWithIndex>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const objectsForDayView = new React.ListState<MessageObjectWithIndex>();

  function processObject(messageObject: MessageObjectWithIndex) {
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
    messageObjects.value.forEach(processObject);
  })

  const objectConverter: React.StateItemConverter<MessageObjectWithIndex> = (
    messageObject
  ) => {
    return ObjectEntryView(
      chat,
      messageObject,
      selectedObject,
      isShowingObjectModal
    );
  };

  return (
    <div
      class="day-view padding flex-column gap scroll-v"
      children:append={[objectsForDayView, objectConverter]}
    ></div>
  );
}
