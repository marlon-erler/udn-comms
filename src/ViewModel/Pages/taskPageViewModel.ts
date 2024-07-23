import * as React from "bloatless-react";

import BoardModel, {
  BoardInfoFileContent,
  BoardInfoFileContentReference,
} from "../../Model/Files/boardModel";
import FileModel, { FileContent } from "../../Model/Files/fileModel";

import BoardViewModel from "./boardViewModel";
import ChatViewModel from "../Chat/chatViewModel";
import { IndexManager } from "../../Model/Utility/utility";
import StorageModel from "../../Model/Global/storageModel";
import { checkMatchesObjectStructure } from "../../Model/Utility/typeSafety";

export default class TaskPageViewModel {
  storageModel: StorageModel;
  boardModel: BoardModel;

  chatViewModel: ChatViewModel;

  // data
  boardIndexManager: IndexManager<BoardViewModel> = new IndexManager(
    (boardViewModel: BoardViewModel) => boardViewModel.name.value
  );

  // paths
  getBasePath = (): string[] => {
    return [...this.boardModel.getViewPath()];
  };

  getBoardViewPath = (boardId): string[] => {
    return [...this.getBasePath(), boardId];
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
    const boardInfo: BoardInfoFileContent = fileContent as BoardInfoFileContent;
    this.showBoardInList(boardInfo);
  };

  // methods
  createBoard = (): void => {
    if (this.cannotCreateBoard.value == true) return;

    const boardInfoFileContent: BoardInfoFileContent =
      this.boardModel.createBoard(this.newBoardNameInput.value);
    this.newBoardNameInput.value = "";

    this.showBoardInList(boardInfoFileContent);
    this.updateIndices();
  };

  updateBoard = (boardInfoFileContent: BoardInfoFileContent): void => {
    this.boardModel.updateBoard(boardInfoFileContent);
    this.updateIndices();
  };

  deleteBoard = (boardInfoFileContent: BoardInfoFileContent): void => {
    this.boardModel.deleteBoard(boardInfoFileContent.fileId);
    this.boardViewModels.remove(boardInfoFileContent.fileId);
    this.updateIndices();
  };

  // view
  showBoardInList = (boardInfo: BoardInfoFileContent): void => {
    const boardViewModel: BoardViewModel = new BoardViewModel(
      this.storageModel,
      this.boardModel,
      this,
      boardInfo
    );
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

    const boardIds: string[] = this.boardModel.listBoardIds();
    for (const boardId of boardIds) {
      const boardInfo: BoardInfoFileContent | null =
        this.boardModel.getBoardInfo(boardId);
      if (boardInfo == null) continue;

      this.showBoardInList(boardInfo);
    }

    this.updateIndices();
    this.openLastUsedBoard();
  };

  // init
  constructor(
    storageModel: StorageModel,
    boardModel: BoardModel,
    chatViewModel: ChatViewModel
  ) {
    this.storageModel = storageModel;
    this.boardModel = boardModel;

    this.chatViewModel = chatViewModel;

    // handlers
    boardModel.boardHandlerManager.addHandler(
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
