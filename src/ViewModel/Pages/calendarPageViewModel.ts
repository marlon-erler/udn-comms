import * as React from "bloatless-react";

import BoardsAndTasksModel, {
  TaskFileContent,
} from "../../Model/Files/boardsAndTasksModel";
import CalendarModel, { MonthGrid } from "../../Model/Files/calendarModel";

import ChatViewModel from "../Chat/chatViewModel";
import CoreViewModel from "../Global/coreViewModel";
import StorageModel from "../../Model/Global/storageModel";
import TaskContainingPageViewModel from "./taskContainingPageViewModel";
import TaskViewModel from "./taskViewModel";

export default class CalendarPageViewModel extends TaskContainingPageViewModel {
  storageModel: StorageModel;
  calendarModel: CalendarModel;
  boardsAndTasksModel: BoardsAndTasksModel;

  chatViewModel: ChatViewModel;

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
  selectedDate: React.State<number> = new React.State(0);

  monthGrid: React.State<MonthGrid<React.MapState<TaskViewModel>> | undefined> =
    new React.State<any>(undefined);

  // methods
  createEvent = (): void => {
    const taskFileContent: TaskFileContent =
      this.boardsAndTasksModel.createTask("events");
    taskFileContent.date = CalendarModel.getISODateString(
      this.selectedYear.value.toString(),
      this.selectedMonth.value.toString(),
      this.selectedDate.value.toString()
    );

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
    const monthString: string | undefined = CalendarModel.isoToMonthString(
      taskFileContent.date ?? ""
    );
    if (monthString == undefined || monthString != this.monthString) {
      // TODO remove
      return;
    }

    const taskViewModel: TaskViewModel = new TaskViewModel(
      this.coreViewModel,
      this.boardsAndTasksModel,
      this,
      taskFileContent
    );
    const mapState: React.MapState<TaskViewModel> | null =
      this.getTaskMapState(taskFileContent);
    mapState?.set(taskFileContent.fileId, taskViewModel);

    this.taskViewModels.set(taskFileContent.fileId, taskViewModel);
  };

  removeTaskFromView = (taskFileContent: TaskFileContent): void => {
    const mapState: React.MapState<TaskViewModel> | null =
      this.getTaskMapState(taskFileContent);
    mapState?.remove(taskFileContent.fileId);

    this.taskViewModels.remove(taskFileContent.fileId);
  };

  showToday = (): void => {
    const today: Date = new Date();
    this.selectedYear.value = today.getFullYear();
    this.selectedMonth.value = today.getMonth() + 1;
    this.selectedDate.value = today.getDate();
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

  handleDrop = (year: string, month: string, date: string): void => {
    const ISOString: string = CalendarModel.getISODateString(year, month, date);

    const draggedObject: any = this.coreViewModel.draggedObject.value;
    if (draggedObject instanceof TaskViewModel == false) return;

    draggedObject.setDate(ISOString);
  };

  // load
  loadMonthTasks = (): void => {
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

    this.updateTaskIndices();
  };

  loadData = (): void => {
    this.loadMonthTasks();
    this.showToday();
  };

  // init
  constructor(
    public coreViewModel: CoreViewModel,
    storageModel: StorageModel,
    calendarModel: CalendarModel,
    boardsAndTasksModel: BoardsAndTasksModel,
    chatViewModel: ChatViewModel
  ) {
    super(coreViewModel, boardsAndTasksModel);

    this.storageModel = storageModel;
    this.calendarModel = calendarModel;
    this.boardsAndTasksModel = boardsAndTasksModel;

    this.chatViewModel = chatViewModel;

    React.bulkSubscribe([this.selectedYear, this.selectedMonth], () => {
      this.loadMonthTasks();
    });

    // handlers
    boardsAndTasksModel.taskHandlerManager.addHandler(
      (taskFileContent: TaskFileContent) => {
        this.showTask(taskFileContent);
      }
    );
  }
}

export enum TaskPageViewModelSubPath {
  LastUsedBoard = "last-used-board",
}
