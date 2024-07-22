import * as React from "bloatless-react";

import TaskModel, {
  BoardInfoFileContent,
  TaskFileContent,
} from "../../Model/Files/taskModel";

import StorageModel from "../../Model/Global/storageModel";

export default class TaskViewModel {
  taskModel: TaskModel;
  storageModel: StorageModel;

  // state
  newBoardNameInput: React.State<string> = new React.State("");

  boards: React.ListState<BoardInfoFileContent> = new React.ListState();

  // guards
  cannotCreateBoard: React.State<boolean> = React.createProxyState(
    [this.newBoardNameInput],
    () => this.newBoardNameInput.value == ""
  );

  // methods
  createBoard = (): void => {
    if (this.cannotCreateBoard.value == true) return;

    this.taskModel.createBoard(this.newBoardNameInput.value);
    this.newBoardNameInput.value = "";
  };

  // init
  constructor(taskModel: TaskModel, storageModel: StorageModel) {
    this.taskModel = taskModel;
    this.storageModel = storageModel;
  }
}
