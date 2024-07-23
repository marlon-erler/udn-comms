import * as React from "bloatless-react";

import TaskModel, {
  BoardInfoFileContent,
  BoardInfoFileContentReference,
} from "../../Model/Files/taskModel";

import BoardViewModel from "./boardViewModel";
import ChatViewModel from "../Chat/chatViewModel";
import { FileContent } from "../../Model/Files/fileModel";
import { IndexManager } from "../../Model/Utility/utility";
import StorageModel from "../../Model/Global/storageModel";
import { checkMatchesObjectStructure } from "../../Model/Utility/typeSafety";

export default class TaskPageViewModel {
  storageModel: StorageModel;
  taskModel: TaskModel;

  chatViewModel: ChatViewModel;

  // data
  boardIndexManager: IndexManager<BoardViewModel> = new IndexManager(
    (boardViewModel: BoardViewModel) => boardViewModel.name.value
  );

  // paths
  getBasePath = (): string[] => {
    return [...this.taskModel.getBasePath()];
  };

  getLastUsedBoardPath = (): string[] => {
    return [...this.getBasePath(), TaskPageViewModelSubPaths.LastUsedBoard];
  };

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
    this.updateIndices();
  };

  updateBoard = (boardInfoFileContent: BoardInfoFileContent): void => {
    this.taskModel.updateBoard(boardInfoFileContent);
    this.updateIndices();
  };

  deleteBoard = (boardInfoFileContent: BoardInfoFileContent): void => {
    this.taskModel.deleteBoard(boardInfoFileContent.fileId);
    this.boardViewModels.remove(boardInfoFileContent.fileId);
    this.updateIndices();
  };

  // view
  showBoardInList = (boardInfo: BoardInfoFileContent): void => {
    const boardViewModel: BoardViewModel = new BoardViewModel(this, boardInfo);
    this.boardViewModels.set(boardInfo.fileId, boardViewModel);
  };

  selectBoard = (boardViewModel: BoardViewModel): void => {
    this.selectedBoardId.value = boardViewModel.boardInfo.fileId;
    this.chatViewModel.displayedColor.value = boardViewModel.color.value;

    this.storeLastUsedBoard();
  };

  closeBoard = (): void => {
    this.selectedBoardId.value = undefined;
    this.chatViewModel.resetColor();

    this.storeLastUsedBoard();
  };

  updateIndices = (): void => {
    this.boardIndexManager.update([...this.boardViewModels.value.values()]);
    for (const boardViewModel of this.boardViewModels.value.values()) {
      boardViewModel.updateIndex();
    }
  };

  // storage
  storeLastUsedBoard = (): void => {
    const path: string[] = this.getLastUsedBoardPath();
    const lastUsedBoardId: string = this.selectedBoardId.value ?? "";
    this.storageModel.write(path, lastUsedBoardId);
  };

  openLastUsedBoard = (): void => {
    const path: string[] = this.getLastUsedBoardPath();
    const lastUsedBoardId: string | null = this.storageModel.read(path);
    if (lastUsedBoardId == null) return;

    const boardViewModel: BoardViewModel | undefined =
      this.boardViewModels.value.get(lastUsedBoardId);
    if (boardViewModel == undefined) return;

    this.selectBoard(boardViewModel);
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

    this.updateIndices();
    this.openLastUsedBoard();
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
        this.updateIndices();
      }
    );
  }
}

export enum TaskPageViewModelSubPaths {
  LastUsedBoard = "last-used-board",
}
