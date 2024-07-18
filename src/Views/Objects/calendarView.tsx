import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { DayView } from "./dayView";
import { MiniatureDayView } from "./miniatureDayView";
import { dayInCalendar } from "../../Model/model";

export function CalendarView(
  chat: Chat,
  messageObjects: React.MapState<MessageObject>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  let monthGridCells = new React.State<HTMLElement[]>([]);

  let previousMonth = 0;
  dayInCalendar.subscribe((newValue) => {
    const selectedDate = new Date(newValue);
    if (selectedDate.getMonth() == previousMonth) return;
    
    previousMonth = selectedDate.getMonth();
    const currentDate = new Date();
    monthGridCells.value = [];

    // initialize to first day of month
    currentDate.setDate(1);
    currentDate.setMonth(selectedDate.getMonth());

    // create blank dates starting sunday
    const monthOffset = currentDate.getDay();
    console.log(monthOffset);
    for (let i = 0; i < monthOffset; i++) {
      monthGridCells.value.push(<div></div>)
    }

    // add day views
    while (currentDate.getMonth() == selectedDate.getMonth()) {
      monthGridCells.value.push(
        MiniatureDayView(
          chat,
          messageObjects,
          new Date(currentDate),
        )
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return (
    <div class="calendar-wrapper">
      <div class="month-grid padding scroll-v">
        <input type="date" bind:value={dayInCalendar}></input>
        <div
          class="grid gap"
          style="grid-template-columns: repeat(7, 1fr)"
          children:set={monthGridCells}
        ></div>
      </div>
      {DayView(chat, messageObjects, selectedObject, isShowingObjectModal)}
    </div>
  );
}
