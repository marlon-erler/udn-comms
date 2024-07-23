import * as React from "bloatless-react";

import TaskModel, { BoardInfoFileContent } from "../../Model/Files/taskModel";

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

  index: React.State<number> = new React.State(0);

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
    this.saveSettings();
    this.isPresentingSettingsModal.value = false;
  };

  updateIndex = (): void => {
    const index: number =
      this.taskPageViewModel.boardIndexManager.getIndex(this);
    this.index.value = index;
  };

  // methods
  saveSettings = (): void => {
    const newBoardInfoFileContent: BoardInfoFileContent =
      TaskModel.createBoardInfoFileContent(
        this.boardInfo.fileId,
        this.name.value,
        this.color.value
      );
    this.taskPageViewModel.updateBoard(newBoardInfoFileContent);
  };

  applyColor = (): void => {
    this.taskPageViewModel.chatViewModel.setDisplayedColor(this.color.value);
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
      [this.taskPageViewModel.selectedBoardId],
      () =>
        this.taskPageViewModel.selectedBoardId.value == this.boardInfo.fileId
    );

    this.color.subscribe(() => {
      if (this.isSelected.value == false) return;
      this.applyColor();
    });
  }
}
