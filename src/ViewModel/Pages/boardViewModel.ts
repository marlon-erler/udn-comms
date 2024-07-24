import * as React from "bloatless-react";

import BoardModel, {
  BoardInfoFileContent,
  TaskFileContent,
} from "../../Model/Files/boardModel";

import { Color } from "../../colors";
import StorageModel from "../../Model/Global/storageModel";
import TaskPageViewModel from "./taskPageViewModel";
import TaskViewModel from "./taskViewModel";

export default class BoardViewModel {
  storageModel: StorageModel;
  boardModel: BoardModel;

  taskPageViewModel: TaskPageViewModel;

  // data
  boardInfo: BoardInfoFileContent;

  // state
  name: React.State<string> = new React.State("");
  color: React.State<Color> = new React.State<Color>(Color.Standard);

  isSelected: React.State<boolean>;
  isPresentingSettingsModal: React.State<boolean> = new React.State(false);
  isPresentingFilterModal: React.State<boolean> = new React.State(false);
  isPresentingNewTaskModal: React.State<boolean> = new React.State(false);

  selectedPage: React.State<BoardPageType> = new React.State<BoardPageType>(
    BoardPageType.List
  );

  index: React.State<number> = new React.State(0);

  taskViewModels: React.MapState<TaskViewModel> = new React.MapState();

  // paths
  getBasePath = (): string[] => {
    return [...this.taskPageViewModel.getBoardViewPath(this.boardInfo.fileId)];
  };

  getLastUsedBoardPath = (): string[] => {
    return [...this.getBasePath(), BoardViewModelSubPaths.LastUsedView];
  };

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

  showFilterModal = (): void => {
    this.isPresentingFilterModal.value = true;
  };

  hideFilterModal = (): void => {
    this.isPresentingFilterModal.value = false;
  };

  showNewTaskModal = (): void => {
    this.isPresentingNewTaskModal.value = true;
  };

  hideNewTaskModal = (): void => {
    this.isPresentingNewTaskModal.value = false;
  };

  updateIndex = (): void => {
    const index: number =
      this.taskPageViewModel.boardIndexManager.getIndex(this);
    this.index.value = index;
  };

  // settings
  saveSettings = (): void => {
    const newBoardInfoFileContent: BoardInfoFileContent =
      BoardModel.createBoardInfoFileContent(
        this.boardInfo.fileId,
        this.name.value,
        this.color.value
      );
    this.taskPageViewModel.updateBoard(newBoardInfoFileContent);
  };

  applyColor = (): void => {
    this.taskPageViewModel.chatViewModel.setDisplayedColor(this.color.value);
  };

  deleteBoard = (): void => {
    this.taskPageViewModel.deleteBoard(this.boardInfo);
    this.close();
  };

  // tasks
  createTask = (): TaskViewModel => {
    const taskFileContent: TaskFileContent = this.boardModel.createTask(this.boardInfo.fileId);
    const taskViewModel: TaskViewModel = new TaskViewModel(this.boardModel, this, taskFileContent);
    return taskViewModel;
  }

  trackTask = (taskViewModel: TaskViewModel): void => {
    this.taskViewModels.set(taskViewModel.task.fileId, taskViewModel);
  }

  // storage
  storeLastUsedView = (): void => {
    const path: string[] = this.getLastUsedBoardPath();
    const lastUsedView: string = this.selectedPage.value;
    this.storageModel.write(path, lastUsedView);
  };

  restoreLastUsedView = (): void => {
    const path: string[] = this.getLastUsedBoardPath();
    const lastUsedView: string | null = this.storageModel.read(path);
    if (lastUsedView == null) return;

    this.selectedPage.value = lastUsedView as BoardPageType;
  };

  // load
  loadListRelevantData = (): void => {
    this.name.value = this.boardInfo.name;
    this.color.value = this.boardInfo.color;
  };

  loadTasks = (): void => {
    this.taskViewModels.clear();

    const taskIds: string[] = this.boardModel.listTaskIds(
      this.boardInfo.fileId
    );
    for (const taskId of taskIds) {
      const taskFileContent: TaskFileContent | null =
        this.boardModel.getTaskFileContent(taskId);
      if (taskFileContent == null) continue;

      const taskViewModel: TaskViewModel = new TaskViewModel(
        this.boardModel,
        this,
        taskFileContent
      );
      this.taskViewModels.set(taskFileContent.fileId, taskViewModel);
    }
  };

  loadData = (): void => {
    this.restoreLastUsedView();
    this.loadTasks();
  };

  // init
  constructor(
    storageModel: StorageModel,
    boardModel: BoardModel,
    taskPageViewModel: TaskPageViewModel,
    boardInfo: BoardInfoFileContent
  ) {
    this.storageModel = storageModel;
    this.boardModel = boardModel;
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
    this.selectedPage.subscribeSilent(() => {
      this.storeLastUsedView();
    });
  }
}

export enum BoardViewModelSubPaths {
  LastUsedView = "last-used-view",
}

// types
export enum BoardPageType {
  List = "list",
  Kanban = "kanban",
  StatusGrid = "status-grid",
}
