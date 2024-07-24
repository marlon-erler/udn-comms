import * as React from "bloatless-react";

import BoardModel, { TaskFileContent } from "../../Model/Files/boardModel";

import BoardViewModel from "./boardViewModel";

export default class TaskViewModel {
  boardModel: BoardModel;

  boardViewModel: BoardViewModel;

  // data
  task: TaskFileContent;

  // paths
  getFilePath = (): string[] => {
    return this.boardModel.getTaskFilePath(this.task.fileId);
  };

  // state
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
