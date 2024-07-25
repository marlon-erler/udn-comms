import * as React from "bloatless-react";

import CalendarPageViewModel from "../../ViewModel/Pages/calendarPageViewModel";

export function CalendarPage(calendarPageViewModel: CalendarPageViewModel) {
  calendarPageViewModel.loadData();

  return <div id="calendar-page"></div>;
}
