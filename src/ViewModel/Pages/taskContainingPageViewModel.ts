import * as React from "bloatless-react";

import BoardsAndTasksModel, {
  TaskFileContent,
} from "../../Model/Files/boardsAndTasksModel";

import BoardViewModel from "./boardViewModel";
import CalendarPageViewModel from "./calendarPageViewModel";
import CoreViewModel from "../Global/coreViewModel";
import { IndexManager } from "../../Model/Utility/utility";
import TaskViewModel from "./taskViewModel";

export default class TaskContainingPageViewModel {
  coreViewModel: CoreViewModel;
  boardsAndTasksModel: BoardsAndTasksModel;

  // state
  taskIndexManager: IndexManager<TaskViewModel> = new IndexManager(
    (taskViewModel: TaskViewModel) => taskViewModel.sortingString
  );

  selectedTaskViewModel: React.State<TaskViewModel | undefined> =
    new React.State<any>(undefined);

  taskViewModels: React.MapState<TaskViewModel> = new React.MapState();

  // methods
  createTaskFromBoardId = (boardId: string): void => {
    const taskFileContent: TaskFileContent =
      this.boardsAndTasksModel.createTask(boardId);
    const taskViewModel: TaskViewModel = new TaskViewModel(
      this.coreViewModel,
      this.boardsAndTasksModel,
      this,
      taskFileContent
    );
    this.selectTask(taskViewModel);
    this.updateTaskIndices();
  };

  // view
  showTask = (taskFileContent: TaskFileContent): void => {};
  removeTaskFromView = (taskFileContent: TaskFileContent): void => {};

  selectTask = (selectedTask: TaskViewModel): void => {
    this.selectedTaskViewModel.value = selectedTask;
  };

  closeTask = () => {
    this.selectedTaskViewModel.value = undefined;
  };

  updateTaskIndices = (): void => {
    this.taskIndexManager.update([...this.taskViewModels.value.values()]);
    for (const boardViewModel of this.taskViewModels.value.values()) {
      boardViewModel.updateIndex();
    }
  };

  // init
  constructor(
    coreViewModel: CoreViewModel,
    boardsAndTasksModel: BoardsAndTasksModel
  ) {
    this.coreViewModel = coreViewModel;
    this.boardsAndTasksModel = boardsAndTasksModel;
  }
}
