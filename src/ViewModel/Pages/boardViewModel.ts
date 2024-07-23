import * as React from "bloatless-react";

import { BoardInfoFileContent } from "../../Model/Files/taskModel";
import { Color } from "../../colors";
import TaskPageViewModel from "./taskPageViewModel";

export default class BoardViewModel {
  taskPageViewModel: TaskPageViewModel;

  // data
  boardInfo: BoardInfoFileContent;

  name: React.State<string> = new React.State("");
  color: React.State<Color> = new React.State<Color>(Color.Standard);

  isSelected: React.State<boolean>;

  // view
  select = (): void => {
    this.taskPageViewModel.selectBoard(this);
  };

  close = (): void => {
    this.taskPageViewModel.closeBoard();
  };

  // load
  loadListRelevantData = (): void => {
    this.name.value = this.boardInfo.name;
    this.color.value = this.boardInfo.color;
  };

  loadData = (): void => {};

  // init
  constructor(
    taskPageViewModel: TaskPageViewModel,
    boardInfo: BoardInfoFileContent
  ) {
    this.taskPageViewModel = taskPageViewModel;
    this.boardInfo = boardInfo;

    this.loadListRelevantData();

    this.isSelected = React.createProxyState(
      [this.taskPageViewModel.selectedBoard],
      () => this.taskPageViewModel.selectedBoard.value == this
    );
  }
}
