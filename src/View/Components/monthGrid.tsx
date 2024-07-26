import "./monthGrid.css";

import * as React from "bloatless-react";
import { MonthGrid } from "../../Model/Files/calendarModel";
import TaskViewModel from "../../ViewModel/Pages/taskViewModel";
import { translations } from "../translations";

export function MonthGrid<T>(monthGrid: MonthGrid<React.MapState<T>>) {
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
    return <span class="ellipsis secondary">{taskViewModel.task.name}</span>;
  };

  return (
    <div class="month-grid-wrapper">
      <div class="day-labels">{...dayLabels}</div>
      <div class="month-grid">
        {...offsetElements}
        {...Object.entries(monthGrid.days).map((entry) => {
          const [date, mapState] = entry;

          return (
            <button class="tile">
              <div>
                <b>{date}</b>
                <div
                  class="flex-column gap clip"
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
