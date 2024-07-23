import * as React from "bloatless-react";

import BoardModel, {
  TaskFileContent,
  TaskFileContentReference,
} from "../../Model/Files/boardModel";

import BoardViewModel from "./boardViewModel";
import StorageModel from "../../Model/Global/storageModel";

export default class TaskViewModel {
  boardModel: BoardModel;
  storageModel: StorageModel;

  boardViewModel: BoardViewModel;

  // data
  fileId: string;

  // paths
  getFilePath = (): string[] => {
    return this.boardModel.getTaskFilePath(this.fileId);
  };

  // state
  name: React.State<string> = new React.State("");

  category: React.State<string> = new React.State("");
  status: React.State<string> = new React.State("");

  description: React.State<string> = new React.State("");

  priority: React.State<string> = new React.State("");
  date: React.State<string> = new React.State("");
  time: React.State<string> = new React.State("");

  // storage
  save = (): void => {
    const newTaskFileContent: TaskFileContent =
      BoardModel.createTaskFileContent(
        this.fileId,
        this.name.value,
        this.boardViewModel.boardInfo.fileId
      );

    newTaskFileContent.status = this.status.value;
    newTaskFileContent.category = this.category.value;
    newTaskFileContent.description = this.description.value;
    newTaskFileContent.priority = this.priority.value;
    newTaskFileContent.date = this.date.value;
    newTaskFileContent.time = this.time.value;

    this.boardModel.updateTask(newTaskFileContent);
  };

  // load
  loadAllData = (): void => {
    const path: string[] = this.getFilePath();
    const taskFileContent: TaskFileContent | null =
      this.storageModel.readStringifiable(path, TaskFileContentReference);
    if (taskFileContent == null) return;

    this.name.value = taskFileContent.name;

    this.category.value = taskFileContent.category ?? "";
    this.status.value = taskFileContent.status ?? "";

    this.description.value = taskFileContent.description ?? "";

    this.priority.value = taskFileContent.priority ?? "";
    this.date.value = taskFileContent.date ?? "";
    this.time.value = taskFileContent.time ?? "";
  };

  // init
  constructor(
    boardModel: BoardModel,
    storageModel: StorageModel,
    boardViewModel: BoardViewModel,
    fileId: string
  ) {
    this.boardModel = boardModel;
    this.storageModel = storageModel;
    this.boardViewModel = boardViewModel;

    this.fileId = fileId;

    this.loadAllData();
  }
}
