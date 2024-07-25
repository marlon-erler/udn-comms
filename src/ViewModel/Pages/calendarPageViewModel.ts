import * as React from "bloatless-react";

import BoardsAndTasksModel, {
  TaskFileContent,
} from "../../Model/Files/boardsAndTasksModel";

import CalendarModel from "../../Model/Files/calendarModel";
import CoreViewModel from "../Global/coreViewModel";
import StorageModel from "../../Model/Global/storageModel";
import TaskViewModel from "./taskViewModel";

export default class CalendarPageViewModel {
  storageModel: StorageModel;
  calendarModel: CalendarModel;
  boardAndTasksModel: BoardsAndTasksModel;

  // paths
  getBasePath = (): string[] => {
    return [...this.calendarModel.getViewPath()];
  };

  // state
  taskViewModels: React.MapState<TaskViewModel> = new React.MapState();

  // view
  showTask = (taskFileContent: TaskFileContent): void => {
    const taskViewModel: TaskViewModel = new TaskViewModel(
      this.coreViewModel,
      this.boardAndTasksModel,
      null,
      this,
      taskFileContent
    );
    this.taskViewModels.set(taskFileContent.fileId, taskViewModel);
  };

  // storage

  // load
  loadData = (): void => {}

  // init
  constructor(
    public coreViewModel: CoreViewModel,
    storageModel: StorageModel,
    calendarModel: CalendarModel,
    boardAndTasksModel: BoardsAndTasksModel,
  ) {
    this.storageModel = storageModel;
    this.calendarModel = calendarModel;
    this.boardAndTasksModel = boardAndTasksModel;
  }
}

export enum TaskPageViewModelSubPath {
  LastUsedBoard = "last-used-board",
}
