import * as React from "bloatless-react";

import TaskModel, {
  BoardInfoFileContent,
  BoardInfoFileContentReference,
} from "../../Model/Files/taskModel";

import BoardViewModel from "./boardViewModel";
import { FileContent } from "../../Model/Files/fileModel";
import StorageModel from "../../Model/Global/storageModel";
import { checkMatchesObjectStructure } from "../../Model/Utility/typeSafety";

export default class TaskPageViewModel {
  taskModel: TaskModel;

  // state
  newBoardNameInput: React.State<string> = new React.State("");

  boardViewModels: React.MapState<BoardViewModel> = new React.MapState();

  // guards
  cannotCreateBoard: React.State<boolean> = React.createProxyState(
    [this.newBoardNameInput],
    () => this.newBoardNameInput.value == ""
  );

  // handlers
  handleFileContent = (fileContent: FileContent<string>): void => {
    if (
      checkMatchesObjectStructure(fileContent, BoardInfoFileContentReference) ==
      false
    )
      return;
    this.showBoard(fileContent as BoardInfoFileContent);
  };

  // methods
  createBoard = (): void => {
    if (this.cannotCreateBoard.value == true) return;

    const boardInfoFileContent: BoardInfoFileContent =
      this.taskModel.createBoard(this.newBoardNameInput.value);
    this.newBoardNameInput.value = "";

    this.showBoard(boardInfoFileContent);
  };

  // view
  showBoard = (boardInfo: BoardInfoFileContent): void => {
    const boardViewModel: BoardViewModel = new BoardViewModel(this, boardInfo);
    this.boardViewModels.set(boardInfo.fileId, boardViewModel);
  };

  // load
  loadData = (): void => {
    this.boardViewModels.clear();

    const boardIds: string[] = this.taskModel.listBoardIds();
    for (const boardId of boardIds) {
      const boardInfo: BoardInfoFileContent | null =
        this.taskModel.getBoardInfo(boardId);
      if (boardInfo == null) continue;

      this.showBoard(boardInfo);
    }
  };

  // init
  constructor(taskModel: TaskModel, storageModel: StorageModel) {
    this.taskModel = taskModel;

    // handlers
    taskModel.boardHandlerManager.addHandler(
      (boardInfoFileContent: BoardInfoFileContent) => {
        this.showBoard(boardInfoFileContent);
      }
    );
  }
}
