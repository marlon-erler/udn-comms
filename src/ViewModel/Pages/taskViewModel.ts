import * as React from "bloatless-react";

import BoardModel, { TaskFileContent } from "../../Model/Files/boardModel";

import BoardViewModel from "./boardViewModel";
import { padZero } from "../../Model/Utility/utility";

export default class TaskViewModel {
  boardModel: BoardModel;

  boardViewModel: BoardViewModel;

  // data
  task: TaskFileContent;

  get sortingString(): string {
    const splitDate: string[] = this.date.value.split("-");
    const year = padZero(splitDate[0], 4);
    const month = padZero(splitDate[1], 2);
    const date = padZero(splitDate[2], 2);

    const splitTime: string[] = this.time.value.split(":");
    const hour = padZero(splitTime[0], 2);
    const minute = padZero(splitTime[1], 2);

    const priorityNumber = parseInt(this.priority.value);
    const invertedPriority = 100 - priorityNumber;

    return (
      year + month + date + hour + minute + invertedPriority + this.name.value
    );
  }

  // paths
  getFilePath = (): string[] => {
    return this.boardModel.getTaskFilePath(this.task.fileId);
  };

  // state
  index: React.State<number> = new React.State(0);

  name: React.State<string> = new React.State("");
  description: React.State<string> = new React.State("");

  category: React.State<string> = new React.State("");
  status: React.State<string> = new React.State("");
  priority: React.State<string> = new React.State("");

  date: React.State<string> = new React.State("");
  time: React.State<string> = new React.State("");

  // view
  open = (): void => {
    this.boardViewModel.selectTask(this);
  };

  close = (): void => {
    this.boardViewModel.closeTask();
  };

  closeAndSave = (): void => {
    this.close();
    this.save();
  };

  updateIndex = (): void => {
    const index: number = this.boardViewModel.taskIndexManager.getIndex(this);
    this.index.value = index;
  };

  // settings
  save = (): void => {
    const newTaskFileContent: TaskFileContent =
      BoardModel.createTaskFileContent(
        this.task.fileId,
        this.name.value,
        this.task.boardId
      );

    newTaskFileContent.description = this.description.value;
    newTaskFileContent.status = this.status.value;
    newTaskFileContent.category = this.category.value;
    newTaskFileContent.priority = this.priority.value;
    newTaskFileContent.date = this.date.value;
    newTaskFileContent.time = this.time.value;

    this.boardModel.updateTaskAndSend(newTaskFileContent);
    this.boardViewModel.showTaskInList(newTaskFileContent);
    this.boardViewModel.updateTaskIndices();
  };

  deleteTask = (): void => {
    this.close();
    this.boardModel.deleteTask(this.task.boardId, this.task.fileId);
    this.boardViewModel.removeTaskFromList(this.task.fileId);
  };

  // load
  loadAllData = (): void => {
    this.name.value = this.task.name;
    this.description.value = this.task.description ?? "";

    this.category.value = this.task.category ?? "";
    this.status.value = this.task.status ?? "";
    this.priority.value = this.task.priority ?? "";

    this.date.value = this.task.date ?? "";
    this.time.value = this.task.time ?? "";
  };

  // init
  constructor(
    boardModel: BoardModel,
    boardViewModel: BoardViewModel,
    taskFileContent: TaskFileContent
  ) {
    this.boardModel = boardModel;
    this.boardViewModel = boardViewModel;

    this.task = taskFileContent;

    this.loadAllData();
  }
}
