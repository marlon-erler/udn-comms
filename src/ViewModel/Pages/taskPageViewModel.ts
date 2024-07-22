import * as React from "bloatless-react";

import TaskModel, { BoardInfoFileContent } from "../../Model/Files/taskModel";

import StorageModel from "../../Model/Global/storageModel";

export default class TaskPageViewModel {
  taskModel: TaskModel;

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

    this.loadData();
  };

  // load
  loadData = (): void => {
    this.boards.clear();

    const boardIds: string[] = this.taskModel.listBoardIds();
    for (const boardId of boardIds) {
      const boardInfo: BoardInfoFileContent | null =
        this.taskModel.getBoardInfo(boardId);
        if (boardInfo == null) continue;
        
      this.boards.add(boardInfo);
    }
  };

  // init
  constructor(taskModel: TaskModel, storageModel: StorageModel) {
    this.taskModel = taskModel;
  }
}
