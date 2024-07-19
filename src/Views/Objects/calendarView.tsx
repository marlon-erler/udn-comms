import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { DayView } from "./dayView";
import { MiniatureDayView } from "./miniatureDayView";
import { dayInCalendar } from "../../Model/model";
import { translation } from "../../translations";

export function CalendarView(
  chat: Chat,
  messageObjects: React.MapState<MessageObject>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  let selectedDate = new Date(dayInCalendar.value);
  const selectedMonth = new React.State(selectedDate.getUTCMonth() + 1);
  const selectedYear = new React.State(selectedDate.getUTCFullYear());

  React.bulkSubscribe([selectedMonth, selectedYear], () =>
    updateSelectedDate()
  );
  dayInCalendar.subscribeSilent(() => {
    selectedDate = new Date(dayInCalendar.value);
  })
  updateSelectedDate();

  function updateSelectedDate() {
    selectedDate.setUTCMonth(selectedMonth.value - 1);
    selectedDate.setUTCFullYear(selectedYear.value);
    dayInCalendar.value = selectedDate.toISOString().split("T")[0];
  }

  function previousMonth() {
    if (selectedMonth.value <= 1) {
      selectedMonth.value = 12;
      selectedYear.value -= 1;
      return;
    }
    selectedMonth.value -= 1;
  }

  function nextMonth() {
    if (selectedMonth.value >= 12) {
      selectedMonth.value = 1;
      selectedYear.value += 1;
      return;
    }
    selectedMonth.value += 1;
  }

  let monthGridCells = new React.State<HTMLElement[]>([]);
  dayInCalendar.subscribe((newValue) => {
    const newSelectedDate = new Date(newValue);

    const currentDate = new Date();
    monthGridCells.value = [];

    // initialize to first day of month
    currentDate.setUTCDate(1);
    currentDate.setUTCMonth(newSelectedDate.getMonth());

    // labels
    for (let i = 0; i < 7; i++) {
      monthGridCells.value.push(
        <b class="secondary ellipsis width-100">{translation.weekdays[i]}</b>
      );
    }

    // create blank dates starting sunday
    const monthOffset = currentDate.getDay();
    for (let i = 0; i < monthOffset; i++) {
      monthGridCells.value.push(<div></div>);
    }

    // add day views
    while (currentDate.getUTCMonth() == newSelectedDate.getUTCMonth()) {
      monthGridCells.value.push(
        MiniatureDayView(chat, messageObjects, currentDate)
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    monthGridCells.callSubscriptions();
  });

  return (
    <div class="calendar-wrapper">
      <div class="month-grid padding scroll-v">
        <div class="flex-row justify-center gap">
          <button
            on:click={previousMonth}
            aria-label={translation.previousMonth}
          >
            <span class="icon">arrow_back</span>
          </button>
          <input
            style="width: 90px"
            type="number"
            bind:value={selectedMonth}
          ></input>
          <input
            style="width: 110px"
            type="number"
            bind:value={selectedYear}
          ></input>
          <button on:click={nextMonth} aria-label={translation.nextMonth}>
            <span class="icon">arrow_forward</span>
          </button>
        </div>
        <hr></hr>
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
