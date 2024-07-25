import * as React from "bloatless-react";

import BoardsAndTasksModel, { TaskFileContent } from "../../Model/Files/boardsAndTasksModel";
import { localeCompare, padZero } from "../../Model/Utility/utility";

import BoardViewModel from "./boardViewModel";
import CoreViewModel from "../Global/coreViewModel";

export default class TaskViewModel {
  boardModel: BoardsAndTasksModel;

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
    return this.boardModel.getTaskFilePath(this.task.fileId);
  };

  // state
  index: React.State<number> = new React.State(0);

  name: React.State<string> = new React.State("");
  description: React.State<string> = new React.State("");

  category: React.State<string> = new React.State("");
  status: React.State<string> = new React.State("");
  priority: React.State<string> = new React.State("");

  date: React.State<string> = new React.State("");
  time: React.State<string> = new React.State("");

  selectedVersionId: React.State<string> = new React.State("");
  versionIds: React.ListState<string> = new React.ListState();

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

    newTaskFileContent.description = this.description.value;
    newTaskFileContent.status = this.status.value;
    newTaskFileContent.category = this.category.value;
    newTaskFileContent.priority = this.priority.value;
    newTaskFileContent.date = this.date.value;
    newTaskFileContent.time = this.time.value;

    this.boardModel.updateTaskAndSend(newTaskFileContent);
    this.boardViewModel.showTaskInList(newTaskFileContent);
    this.boardViewModel.updateTaskIndices();
  };

  deleteTask = (): void => {
    this.close();
    this.boardModel.deleteTask(this.task.boardId, this.task.fileId);
    this.boardViewModel.removeTaskFromList(this.task.fileId);
  };

  // load
  loadVersionIds = (): void => {
    const versionIds: string[] = this.boardModel.listTaskVersionIds(
      this.task.fileId
    );
    const sortedVersionIds = versionIds.sort(localeCompare).reverse();
    this.versionIds.clear();
    this.versionIds.add(...sortedVersionIds);
  };

  switchVersion = (versionId: string): void => {
    const taskFileContent: TaskFileContent | null =
      this.boardModel.getSpecificTaskFileContent(this.task.fileId, versionId);
    if (taskFileContent == null) return;

    this.task = taskFileContent;
    this.loadTaskData();
  };

  loadAllData = (): void => {
    this.loadTaskData();
    this.loadVersionIds();
  };

  loadTaskData = (): void => {
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
    this.boardModel = boardModel;
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
