// it is responsible for managing calendar-realted reference files for tasks.

import FileModel, { FileModelSubPath } from "./fileModel";

import SettingsModel from "../Global/settingsModel";
import StorageModel from "../Global/storageModel";
import { TaskFileContent } from "./boardsAndTasksModel";

export default class CalendarModel {
  storageModel: StorageModel;
  fileModel: FileModel;
  settingsModel: SettingsModel;

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

  generateMonthGrid = <T>(
    year: number,
    month: number,
    defaultValueCreator: () => T
  ): MonthGrid<T> => {
    // get today
    const date: Date = new Date();
    const isCurrentMonth: boolean =
      year == date.getFullYear() && month == date.getMonth() + 1;

    // get first day of month
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(1);

    // get offset
    const offset: number =
      date.getDay() - parseInt(this.settingsModel.firstDayOfWeek);

    // get total day count
    date.setMonth(month);
    date.setDate(-1);
    const daysInMonth: number = date.getDate() + 1;

    const grid: MonthGrid<T> = {
      offset,
      firstDayOfWeek: parseInt(this.settingsModel.firstDayOfWeek),
      isCurrentMonth,
      days: {},
    };

    for (let i = 0; i < daysInMonth; i++) {
      grid.days[i + 1] = defaultValueCreator();
    }

    return grid;
  };

  // init
  constructor(
    storageModel: StorageModel,
    settingsModel: SettingsModel,
    fileModel: FileModel
  ) {
    this.storageModel = storageModel;
    this.settingsModel = settingsModel;
    this.fileModel = fileModel;
  }

  // utility
  static isoToMonthString = (dateISOString: string): string => {
    const [year, month, _] = dateISOString.split("-");
    return CalendarModel.getMonthString(year, month);
  };

  static isoToDateString = (dateISOString: string): string | undefined => {
    const [year, month, date, _] = dateISOString.split("-");
    return date;
  };

  static getMonthString = (year: string = "", month: string = ""): string => {
    const paddedYear: string = year.padStart(4, "0");
    const paddedMonth: string = month.padStart(2, "0");
    return `${paddedYear}-${paddedMonth}`;
  };
}

export enum CalendarModelSubPaths {
  Months = "months",
}

// types
export interface MonthGrid<T> {
  offset: number;
  firstDayOfWeek: number;
  isCurrentMonth: boolean;
  days: { [date: string]: T };
}
