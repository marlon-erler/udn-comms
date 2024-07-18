import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectGridView } from "./objectGridView";
import { DayView } from "./dayView";
import { dayInCalendar } from "../../Model/model";

export function CalendarView(
  chat: Chat,
  messageObjects: React.MapState<MessageObject>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  return <div class="calendar-wrapper">
      <div class="month-grid">
        <input type="date" bind:value={dayInCalendar}></input>
      </div>
      {DayView(chat, messageObjects, selectedObject, isShowingObjectModal)}
    </div>
}
