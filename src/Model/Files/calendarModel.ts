// this file extends the BoardsAndTasksModel regarding calendar features.
// it is responsible for managing calendar-realted reference files for tasks.

import BoardsAndTasksModel, {
  TaskFileContent,
  TaskFileContentReference,
} from "./boardsAndTasksModel";
import FileModel, { FileContent, FileModelSubPath } from "./fileModel";

import StorageModel from "../Global/storageModel";
import { checkMatchesObjectStructure } from "../Utility/typeSafety";

export default class CalendarModel {
  storageModel: StorageModel;
  fileModel: FileModel;

  // paths
  getBasePath = (): string[] => {
    return this.fileModel.getModelContainerPath(FileModelSubPath.ModelCalendar);
  };

  getViewPath = (): string[] => {
    return [...this.getBasePath(), FileModelSubPath.ModelView];
  };

  getMonthContainerPath = (): string[] => {
    return [...this.getBasePath(), CalendarModelSubPaths.Months];
  };

  getMonthPath = (monthString: string): string[] => {
    return [...this.getMonthContainerPath(), monthString];
  };

  // handlers
  handleFileContent = (fileContent: FileContent<string>): void => {
    if (
      checkMatchesObjectStructure(fileContent, TaskFileContentReference) ==
      false
    )
      return;
  };

  // main
  storeTaskReference = (taskFileContent: TaskFileContent): void => {
    if (taskFileContent.date == undefined) return;
    const monthString: string = CalendarModel.isoToMonthString(
      taskFileContent.date
    );

    const monthPath: string[] = this.getMonthPath(monthString);
    const referencePath: string[] = [...monthPath, taskFileContent.fileId];

    this.storageModel.write(referencePath, "");
  };

  listTaskIds = (monthString: string): string[] => {
    const monthPath: string[] = this.getMonthPath(monthString);
    return this.storageModel.list(monthPath);
  };

  // init
  constructor(
    storageModel: StorageModel,
    fileModel: FileModel,  ) {
    this.storageModel = storageModel;
    this.fileModel = fileModel;
  }

  // utility
  static isoToMonthString = (dateISOString: string): string => {
    const [year, month, _] = dateISOString.split("-");
    return `${year}-${month}`;
  };
}

export enum CalendarModelSubPaths {
  Months = "months",
}
