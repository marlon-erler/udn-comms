import "./monthGrid.css";

import * as React from "bloatless-react";
import { MonthGrid } from "../../Model/Files/calendarModel";
import TaskViewModel from "../../ViewModel/Pages/taskViewModel";

export function MonthGrid<T>(monthGrid: MonthGrid<React.MapState<T>>) {
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
  );
}
