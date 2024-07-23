import * as React from "bloatless-react";

import { BoardInfoFileContent } from "../../Model/Files/taskModel";
import { Color } from "../../colors";
import TaskPageViewModel from "./taskPageViewModel";

export default class BoardViewModel {
  taskPageViewModel: TaskPageViewModel;

  // state
  boardInfo: BoardInfoFileContent;

  name: React.State<string> = new React.State("");
  color: React.State<Color> = new React.State<Color>(Color.Standard);

  isSelected: React.State<boolean>;
  isPresentingSettingsModal: React.State<boolean> = new React.State(false);

  // view
  select = (): void => {
    this.taskPageViewModel.selectBoard(this);
  };

  close = (): void => {
    this.taskPageViewModel.closeBoard();
  };

  showSettings = (): void => {
    this.isPresentingSettingsModal.value = true;
  };

  hideSettings = (): void => {
    this.isPresentingSettingsModal.value = false;
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
