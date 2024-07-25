import * as React from "bloatless-react";

import BoardsAndTasksModel, {
  TaskFileContent,
} from "../../Model/Files/boardsAndTasksModel";
import { localeCompare, padZero } from "../../Model/Utility/utility";

import BoardViewModel from "./boardViewModel";
import CoreViewModel from "../Global/coreViewModel";
import { allowDrag } from "../../View/utility";

export default class TaskViewModel {
  boardsAndTasksModel: BoardsAndTasksModel;

  boardViewModel: BoardViewModel;

  // data
  task: TaskFileContent;

  get sortingString(): string {
    const splitDate: string[] = this.date.value.split("-");
    const year = padZero(splitDate[0], 4);
    const month = padZero(splitDate[1], 2);
    const date = padZero(splitDate[2], 2);

    const splitTime: string[] = this.time.value.split(":");
    const hour = padZero(splitTime[0], 2);
    const minute = padZero(splitTime[1], 2);

    const priorityNumber = parseInt(this.priority.value);
    const invertedPriority = 100 - priorityNumber;

    return (
      year + month + date + hour + minute + invertedPriority + this.name.value
    );
  }

  // paths
  getFilePath = (): string[] => {
    return this.boardsAndTasksModel.getTaskFilePath(this.task.fileId);
  };

  // state
  index: React.State<number> = new React.State(0);

  boardId: React.State<string> = new React.State("");

  name: React.State<string> = new React.State("");
  description: React.State<string> = new React.State("");

  category: React.State<string> = new React.State("");
  status: React.State<string> = new React.State("");
  priority: React.State<string> = new React.State("");

  date: React.State<string> = new React.State("");
  time: React.State<string> = new React.State("");

  selectedVersionId: React.State<string> = new React.State("");
  versionIds: React.ListState<string> = new React.ListState();

  // methods
  dragStart = (event: DragEvent): void => {
    allowDrag(event);
    this.coreViewModel.draggedObject.value = this;
  };

  setCategoryAndStatus = (category?: string, status?: string): void => {
    if (category != undefined) this.category.value = category;
    if (status != undefined) this.status.value = status;
    this.save();
  };

  setBoardId = (boardId: string): void => {
    this.boardId.value = boardId;
    this.save();
  };

  // view
  open = (): void => {
    this.boardViewModel.selectTask(this);
  };

  close = (): void => {
    this.boardViewModel.closeTask();
  };

  closeAndSave = (): void => {
    this.close();
    this.save();
  };

  updateIndex = (): void => {
    const index: number = this.boardViewModel.taskIndexManager.getIndex(this);
    this.index.value = index;
  };

  // settings
  save = (): void => {
    const newTaskFileContent: TaskFileContent =
      BoardsAndTasksModel.createTaskFileContent(
        this.task.fileId,
        this.name.value,
        this.task.boardId
      );

    newTaskFileContent.boardId = this.boardId.value;
    newTaskFileContent.description = this.description.value;
    newTaskFileContent.status = this.status.value;
    newTaskFileContent.category = this.category.value;
    newTaskFileContent.priority = this.priority.value;
    newTaskFileContent.date = this.date.value;
    newTaskFileContent.time = this.time.value;

    this.boardsAndTasksModel.updateTaskAndSend(newTaskFileContent);
    this.boardViewModel.showTaskInList(newTaskFileContent);
    this.boardViewModel.updateTaskIndices();
  };

  deleteTask = (): void => {
    this.close();
    this.boardsAndTasksModel.deleteTask(this.task.boardId, this.task.fileId);
    this.boardViewModel.removeTaskFromList(this.task.fileId);
  };

  // load
  loadVersionIds = (): void => {
    const versionIds: string[] = this.boardsAndTasksModel.listTaskVersionIds(
      this.task.fileId
    );
    const sortedVersionIds = versionIds.sort(localeCompare).reverse();
    this.versionIds.clear();
    this.versionIds.add(...sortedVersionIds);
  };

  switchVersion = (versionId: string): void => {
    const taskFileContent: TaskFileContent | null =
      this.boardsAndTasksModel.getSpecificTaskFileContent(
        this.task.fileId,
        versionId
      );
    if (taskFileContent == null) return;

    this.task = taskFileContent;
    this.loadTaskData();
  };

  loadAllData = (): void => {
    this.loadTaskData();
    this.loadVersionIds();
  };

  loadTaskData = (): void => {
    this.boardId.value = this.task.boardId;

    this.name.value = this.task.name;
    this.description.value = this.task.description ?? "";

    this.category.value = this.task.category ?? "";
    this.status.value = this.task.status ?? "";
    this.priority.value = this.task.priority ?? "";

    this.date.value = this.task.date ?? "";
    this.time.value = this.task.time ?? "";

    this.selectedVersionId.value = this.task.fileContentId;
  };

  // init
  constructor(
    public coreViewModel: CoreViewModel,
    boardModel: BoardsAndTasksModel,
    boardViewModel: BoardViewModel,
    taskFileContent: TaskFileContent
  ) {
    this.boardsAndTasksModel = boardModel;
    this.boardViewModel = boardViewModel;

    this.task = taskFileContent;

    // load
    this.loadAllData();

    // subscriptions
    this.selectedVersionId.subscribeSilent((selectedVersionId) => {
      this.switchVersion(selectedVersionId);
    });
  }
}
