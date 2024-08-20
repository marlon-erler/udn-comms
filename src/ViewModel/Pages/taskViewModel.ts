import * as React from "bloatless-react";

import BoardsAndTasksModel, {
  TaskFileContent,
} from "../../Model/Files/boardsAndTasksModel";
import { localeCompare, padZero } from "../../Model/Utility/utility";

import ChatViewModel from "../Chat/chatViewModel";
import CoreViewModel from "../Global/coreViewModel";
import TaskContainingPageViewModel from "./taskContainingPageViewModel";
import { allowDrag } from "../../View/utility";

export default class TaskViewModel {
  boardsAndTasksModel: BoardsAndTasksModel;

  containingModel: TaskContainingPageViewModel;

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

  setDate = (dateISOString: string): void => {
    this.date.value = dateISOString;
    this.save();
  };

  // view
  open = (): void => {
    this.containingModel.selectTask(this);
  };

  close = (): void => {
    this.containingModel.closeTask();
  };

  closeAndDiscard = (): void => {
    this.close();
    this.loadTaskData();
  }

  closeAndSave = (): void => {
    this.close();
    this.save();
  };

  updateIndex = (): void => {
    const index: number = this.containingModel.taskIndexManager.getIndex(this);
    this.index.value = index;
  };

  updateSuggestions = (): void => {
    if (
      this.coreViewModel.taskCategorySuggestions.value.has(
        this.category.value
      ) == false
    ) {
      this.coreViewModel.taskCategorySuggestions.add(this.category.value);
    }

    if (
      this.coreViewModel.taskStatusSuggestions.value.has(this.status.value) ==
      false
    ) {
      this.coreViewModel.taskStatusSuggestions.add(this.status.value);
    }
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

    this.containingModel.showTask(newTaskFileContent);
    this.containingModel.updateTaskIndices();

    this.updateSuggestions();
  };

  deleteTask = (): void => {
    this.close();
    this.boardsAndTasksModel.deleteTask(this.task.boardId, this.task.fileId);
    this.containingModel.removeTaskFromView(this.task);
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

    this.updateSuggestions();
  };

  // init
  constructor(
    public coreViewModel: CoreViewModel,
    public chatViewModel: ChatViewModel,
    boardsAndTasksModel: BoardsAndTasksModel,
    containingModel: TaskContainingPageViewModel,
    taskFileContent: TaskFileContent
  ) {
    this.boardsAndTasksModel = boardsAndTasksModel;
    this.containingModel = containingModel;

    this.task = taskFileContent;

    // load
    this.loadAllData();

    // subscriptions
    this.selectedVersionId.subscribeSilent((selectedVersionId) => {
      this.switchVersion(selectedVersionId);
    });
  }

  // utility
  static getStringsForFilter = (taskViewModel: TaskViewModel): string[] => {
    return [
      taskViewModel.task.name,
      taskViewModel.task.description ?? "",
      taskViewModel.task.category ?? "",
      taskViewModel.task.status ?? "",
      taskViewModel.task.priority ?? "",
      taskViewModel.task.date ?? "",
      taskViewModel.task.time ?? "",
    ];
  };
}
