import "./monthGrid.css";

import * as React from "bloatless-react";
import { MonthGrid } from "../../Model/Files/calendarModel";
import TaskViewModel from "../../ViewModel/Pages/taskViewModel";
import { translations } from "../translations";
import { allowDrop } from "../utility";
import { localeCompare } from "../../Model/Utility/utility";

export function MonthGrid<T>(
  monthGrid: MonthGrid<React.MapState<T>>,
  selectedDate: React.State<number>,
  handleDrop: (date: string) => void
) {
  const dayLabels: HTMLElement[] = [];
  let currentWeekday = monthGrid.firstDayOfWeek;
  while (dayLabels.length < 7) {
    dayLabels.push(
      <span class="secondary">
        {translations.regional.weekdays.abbreviated[currentWeekday]}
      </span>
    );
    currentWeekday++;
    if (currentWeekday == 7) currentWeekday = 0;
  }

  const offsetElements: HTMLElement[] = [];
  for (let i = 0; i < monthGrid.offset; i++) {
    offsetElements.push(<div></div>);
  }

  const converter: React.StateItemConverter<TaskViewModel> = (
    taskViewModel
  ) => {
    const view = (
      <span class="ellipsis secondary">{taskViewModel.task.name}</span>
    );

    taskViewModel.index.subscribe((newIndex) => {
      view.style.order = newIndex;
    });

    return view;
  };

  return (
    <div class="month-grid-wrapper">
      <div class="day-labels">{...dayLabels}</div>
      <div class="month-grid">
        {...offsetElements}
        {...Object.entries(monthGrid.days)
          .sort((a, b) => localeCompare(a[0], b[0]))
          .map((entry) => {
            const [date, mapState] = entry;

            const isSelected = React.createProxyState(
              [selectedDate],
              () => selectedDate.value == parseInt(date)
            );

            const isToday: boolean =
              monthGrid.isCurrentMonth == true &&
              parseInt(date) == new Date().getDate();

            const eventCount: React.State<number> = React.createProxyState(
              [mapState],
              () => mapState.value.size
            );

            const hasEvents: React.State<boolean> = React.createProxyState(
              [eventCount],
              () => eventCount.value != 0
            );

            function select() {
              selectedDate.value = parseInt(date);
            }

            function drop() {
              handleDrop(date);
            }

            return (
              <button
                class="tile"
                on:click={select}
                toggle:selected={isSelected}
                toggle:today={isToday}
                on:dragover={allowDrop}
                on:drop={drop}
              >
                <div>
                  <b>{date}</b>
                  <span
                    class="event-count"
                    toggle:has-events={hasEvents}
                    subscribe:innerText={eventCount}
                  ></span>
                  <div
                    class="event-list"
                    children:append={[mapState, converter]}
                  ></div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
