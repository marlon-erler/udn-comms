import * as React from "bloatless-react";

import BoardsAndTasksModel, {
  BoardInfoFileContent,
  TaskFileContent,
} from "../../Model/Files/boardsAndTasksModel";

import { Color } from "../../colors";
import CoreViewModel from "../Global/coreViewModel";
import { IndexManager } from "../../Model/Utility/utility";
import StorageModel from "../../Model/Global/storageModel";
import TaskContainingPageViewModel from "./taskContainingPageViewModel";
import TaskPageViewModel from "./taskPageViewModel";
import TaskViewModel from "./taskViewModel";

export default class BoardViewModel extends TaskContainingPageViewModel {
  storageModel: StorageModel;
  boardsAndTasksModel: BoardsAndTasksModel;

  taskPageViewModel: TaskPageViewModel;

  // data
  boardInfo: BoardInfoFileContent;

  // state
  name: React.State<string> = new React.State("");
  color: React.State<Color> = new React.State<any>(Color.Standard);

  index: React.State<number> = new React.State(0);

  selectedPage: React.State<BoardPageType> = new React.State<any>(
    BoardPageType.List
  );

  isSelected: React.State<boolean>;
  isPresentingSettingsModal: React.State<boolean> = new React.State(false);
  isPresentingFilterModal: React.State<boolean> = new React.State(false);

  filteredTaskViewModels: React.ListState<TaskViewModel> =
    new React.ListState();

  // paths
  getBasePath = (): string[] => {
    return [...this.taskPageViewModel.getBoardViewPath(this.boardInfo.fileId)];
  };

  getLastUsedBoardPath = (): string[] => {
    return [...this.getBasePath(), BoardViewModelSubPath.LastUsedView];
  };

  // settings
  saveSettings = (): void => {
    const newBoardInfoFileContent: BoardInfoFileContent =
      BoardsAndTasksModel.createBoardInfoFileContent(
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

  // methods
  handleDropWithinBoard = (category?: string, status?: string): void => {
    const draggedObject: any = this.coreViewModel.draggedObject.value;
    if (draggedObject instanceof TaskViewModel == false) return;
    draggedObject.setCategoryAndStatus(category, status);
  };

  handleDropBetweenBoards = (): void => {
    const draggedObject: any = this.coreViewModel.draggedObject.value;
    if (draggedObject instanceof TaskViewModel == false) return;
    draggedObject.setBoardId(this.boardInfo.fileId);
  };

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

  // view
  showTask = (taskFileContent: TaskFileContent): void => {
    if (taskFileContent.boardId != this.boardInfo.fileId) {
      // remove task that was moved to different board
      this.boardsAndTasksModel.deleteTaskReference(
        this.boardInfo.fileId,
        taskFileContent.fileId
      );
      this.removeTaskFromView(taskFileContent);
      return;
    }

    const taskViewModel: TaskViewModel = new TaskViewModel(
      this.coreViewModel,
      this.boardsAndTasksModel,
      this,
      taskFileContent
    );
    this.taskViewModels.set(taskFileContent.fileId, taskViewModel);
  };

  removeTaskFromView = (taskFileContent: TaskFileContent): void => {
    this.taskViewModels.remove(taskFileContent.fileId);
    this.updateIndex();
  };

  select = (): void => {
    this.taskPageViewModel.selectBoard(this);
  };

  close = (): void => {
    this.taskPageViewModel.closeBoard();
    this.taskViewModels.clear();
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

  updateIndex = (): void => {
    const index: number =
      this.taskPageViewModel.boardIndexManager.getIndex(this);
    this.index.value = index;
  };

  // load
  loadListRelevantData = (): void => {
    this.name.value = this.boardInfo.name;
    this.color.value = this.boardInfo.color;
  };

  loadTasks = (): void => {
    const taskIds: string[] = this.boardsAndTasksModel.listTaskIds(
      this.boardInfo.fileId
    );
    for (const taskId of taskIds) {
      if (this.taskViewModels.value.has(taskId)) return;

      const taskFileContent: TaskFileContent | null =
        this.boardsAndTasksModel.getLatestTaskFileContent(taskId);
      if (taskFileContent == null) continue;

      const taskViewModel: TaskViewModel = new TaskViewModel(
        this.coreViewModel,
        this.boardsAndTasksModel,
        this,
        taskFileContent
      );
      this.taskViewModels.set(taskFileContent.fileId, taskViewModel);
    }

    this.updateTaskIndices();
  };

  loadData = (): void => {
    this.restoreLastUsedView();
    this.loadTasks();
  };

  // init
  constructor(
    public coreViewModel: CoreViewModel,
    storageModel: StorageModel,
    boardsAndTasksModel: BoardsAndTasksModel,
    taskPageViewModel: TaskPageViewModel,
    boardInfo: BoardInfoFileContent
  ) {
    super(coreViewModel, boardsAndTasksModel);

    // set
    this.storageModel = storageModel;
    this.boardsAndTasksModel = boardsAndTasksModel;
    this.taskPageViewModel = taskPageViewModel;
    this.boardInfo = boardInfo;

    // load
    this.loadListRelevantData();

    // subscriptions
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

    // handlers
    boardsAndTasksModel.taskHandlerManager.addHandler(
      (taskFileContent: TaskFileContent) => {
        if (taskFileContent.boardId != this.boardInfo.fileId) return;
        this.showTask(taskFileContent);
        this.updateTaskIndices();
      }
    );
  }
}

export enum BoardViewModelSubPath {
  LastUsedView = "last-used-view",
}

// types
export enum BoardPageType {
  List = "list",
  Kanban = "kanban",
  StatusGrid = "status-grid",
}
