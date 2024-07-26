import * as React from "bloatless-react";

import BoardsAndTasksModel, {
  TaskFileContent,
} from "../../Model/Files/boardsAndTasksModel";
import CalendarModel, { MonthGrid } from "../../Model/Files/calendarModel";

import CoreViewModel from "../Global/coreViewModel";
import StorageModel from "../../Model/Global/storageModel";
import TaskViewModel from "./taskViewModel";

export default class CalendarPageViewModel {
  storageModel: StorageModel;
  calendarModel: CalendarModel;
  boardsAndTasksModel: BoardsAndTasksModel;

  // data
  get monthString(): string {
    return CalendarModel.getMonthString(
      this.selectedYear.value.toString(),
      this.selectedMonth.value.toString()
    );
  }

  // paths
  getBasePath = (): string[] => {
    return [...this.calendarModel.getViewPath()];
  };

  // state
  selectedYear: React.State<number> = new React.State(0);
  selectedMonth: React.State<number> = new React.State(0);

  monthGrid: React.State<MonthGrid<React.MapState<TaskViewModel>> | undefined> =
    new React.State<any>(undefined);

  // view
  getTaskMapState = (
    taskFileContent: TaskFileContent
  ): React.MapState<TaskViewModel> | null => {
    if (this.monthGrid.value == null) return null;

    const dateString: string | undefined = CalendarModel.isoToDateString(
      taskFileContent.date ?? ""
    );
    if (dateString == undefined) return null;
    return this.monthGrid.value.days[dateString];
  };

  showTask = (taskFileContent: TaskFileContent): void => {
    const taskViewModel: TaskViewModel = new TaskViewModel(
      this.coreViewModel,
      this.boardsAndTasksModel,
      null,
      this,
      taskFileContent
    );
    const mapState: React.MapState<TaskViewModel> | null =
      this.getTaskMapState(taskFileContent);
    mapState?.set(taskFileContent.fileId, taskViewModel);
  };

  removeTaskFromList = (taskFileContent: TaskFileContent): void => {
    const mapState: React.MapState<TaskViewModel> | null =
      this.getTaskMapState(taskFileContent);
    mapState?.remove(taskFileContent.fileId);
  };

  showToday = (): void => {
    const today: Date = new Date();
    this.selectedYear.value = today.getFullYear();
    this.selectedMonth.value = today.getMonth() + 1;
  };

  showPreviousMonth = (): void => {
    this.selectedMonth.value -= 1;

    if (this.selectedMonth.value <= 0) {
      this.selectedYear.value -= 1;
      this.selectedMonth.value = 12;
    }
  };

  showNextMonth = (): void => {
    this.selectedMonth.value += 1;

    if (this.selectedMonth.value >= 13) {
      this.selectedYear.value += 1;
      this.selectedMonth.value = 1;
    }
  };

  // storage

  // load
  loadTasks = (): void => {
    this.monthGrid.value = this.calendarModel.generateMonthGrid(
      this.selectedYear.value,
      this.selectedMonth.value,
      () => new React.MapState()
    );
    const taskIds: string[] = this.calendarModel.listTaskIds(this.monthString);

    for (const taskId of taskIds) {
      const taskFileContent: TaskFileContent | null =
        this.boardsAndTasksModel.getLatestTaskFileContent(taskId);
      if (taskFileContent == null) continue;
      this.showTask(taskFileContent);
    }
  };

  loadData = (): void => {
    this.loadTasks();
    this.showToday();
  };

  // init
  constructor(
    public coreViewModel: CoreViewModel,
    storageModel: StorageModel,
    calendarModel: CalendarModel,
    boardAndTasksModel: BoardsAndTasksModel
  ) {
    this.storageModel = storageModel;
    this.calendarModel = calendarModel;
    this.boardsAndTasksModel = boardAndTasksModel;

    React.bulkSubscribe([this.selectedYear, this.selectedMonth], () => {
      this.loadTasks();
    });
  }
}

export enum TaskPageViewModelSubPath {
  LastUsedBoard = "last-used-board",
}
