import * as React from "bloatless-react";

import TaskModel, {
  BoardInfoFileContent,
  BoardInfoFileContentReference,
} from "../../Model/Files/taskModel";

import BoardViewModel from "./boardViewModel";
import ChatViewModel from "../Chat/chatViewModel";
import { FileContent } from "../../Model/Files/fileModel";
import StorageModel from "../../Model/Global/storageModel";
import { checkMatchesObjectStructure } from "../../Model/Utility/typeSafety";

export default class TaskPageViewModel {
  storageModel: StorageModel;
  taskModel: TaskModel;

  chatViewModel: ChatViewModel;

  // state
  newBoardNameInput: React.State<string> = new React.State("");

  boardViewModels: React.MapState<BoardViewModel> = new React.MapState();

  selectedBoardId: React.State<string | undefined> = new React.State<
    string | undefined
  >(undefined);

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
    this.showBoardInList(fileContent as BoardInfoFileContent);
  };

  // methods
  createBoard = (): void => {
    if (this.cannotCreateBoard.value == true) return;

    const boardInfoFileContent: BoardInfoFileContent =
      this.taskModel.createBoard(this.newBoardNameInput.value);
    this.newBoardNameInput.value = "";

    this.showBoardInList(boardInfoFileContent);
  };

  updateBoard = (boardInfoFileContent: BoardInfoFileContent): void => {
    this.taskModel.updateBoard(boardInfoFileContent);
  };

  // view
  showBoardInList = (boardInfo: BoardInfoFileContent): void => {
    const boardViewModel: BoardViewModel = new BoardViewModel(this, boardInfo);
    this.boardViewModels.set(boardInfo.fileId, boardViewModel);
  };

  selectBoard = (boardViewModel: BoardViewModel): void => {
    this.selectedBoardId.value = boardViewModel.boardInfo.fileId;
    this.chatViewModel.displayedColor.value = boardViewModel.color.value;
  };

  closeBoard = (): void => {
    this.selectedBoardId.value = undefined;
    this.chatViewModel.resetColor();
  };

  // load
  loadData = (): void => {
    this.boardViewModels.clear();

    const boardIds: string[] = this.taskModel.listBoardIds();
    for (const boardId of boardIds) {
      const boardInfo: BoardInfoFileContent | null =
        this.taskModel.getBoardInfo(boardId);
      if (boardInfo == null) continue;

      this.showBoardInList(boardInfo);
    }
  };

  // init
  constructor(
    taskModel: TaskModel,
    storageModel: StorageModel,
    chatViewModel: ChatViewModel
  ) {
    this.taskModel = taskModel;
    this.storageModel = storageModel;

    this.chatViewModel = chatViewModel;

    // handlers
    taskModel.boardHandlerManager.addHandler(
      (boardInfoFileContent: BoardInfoFileContent) => {
        this.showBoardInList(boardInfoFileContent);
      }
    );
  }
}
