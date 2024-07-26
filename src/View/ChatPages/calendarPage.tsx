import "./calendarPage.css";

import * as React from "bloatless-react";

import CalendarPageViewModel from "../../ViewModel/Pages/calendarPageViewModel";
import { MonthGrid } from "../Components/monthGrid";
import { TaskViewModelToEntry } from "../Components/taskEntry";
import { createPropertyValueIndexState } from "../Components/propertyValueList";
import { translations } from "../translations";

export function CalendarPage(calendarPageViewModel: CalendarPageViewModel) {
  calendarPageViewModel.loadData();

  const mainContent = React.createProxyState(
    [calendarPageViewModel.monthGrid],
    () => {
      if (calendarPageViewModel.monthGrid.value == undefined) {
        return <div></div>;
      } else {
        return MonthGrid(calendarPageViewModel.monthGrid.value);
      }
    }
  );

  return (
    <div id="calendar-page">
      <div class="pane-wrapper">
        <div class="pane">
          <div class="toolbar">
            <span>
              <button
                class="ghost"
                aria-label={
                  translations.chatPage.calendar.todayButtonAudioLabel
                }
                on:click={calendarPageViewModel.showToday}
              >
                <span class="icon">today</span>
              </button>
            </span>
            <span>
              <button
                class="ghost"
                aria-label={
                  translations.chatPage.calendar.previousMonthButtonAudioLabel
                }
                on:click={calendarPageViewModel.showPreviousMonth}
              >
                <span class="icon">arrow_back</span>
              </button>
              <span class="input-wrapper">
                <input
                  class="year-input"
                  type="number"
                  aria-label={
                    translations.chatPage.calendar.yearInputAudioLabel
                  }
                  placeholder={
                    translations.chatPage.calendar.yearInputPlaceholder
                  }
                  bind:value={calendarPageViewModel.selectedYear}
                ></input>
                <input
                  class="month-input"
                  type="number"
                  aria-label={
                    translations.chatPage.calendar.monthInputAudioLabel
                  }
                  placeholder={
                    translations.chatPage.calendar.monthInputPlaceholder
                  }
                  bind:value={calendarPageViewModel.selectedMonth}
                ></input>
              </span>
              <button
                class="ghost"
                aria-label={
                  translations.chatPage.calendar.nextMonthButtonAudioLabel
                }
                on:click={calendarPageViewModel.showNextMonth}
              >
                <span class="icon">arrow_forward</span>
              </button>
            </span>
            <span>
              <button
                class="ghost"
                aria-label={
                  translations.chatPage.task.createTaskButtonAudioLabel
                }
              >
                <span class="icon">add</span>
              </button>
            </span>
          </div>
          <div class="content" children:set={mainContent}></div>
        </div>
      </div>
    </div>
  );
}
