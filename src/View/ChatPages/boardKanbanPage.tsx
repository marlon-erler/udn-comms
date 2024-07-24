import * as React from "bloatless-react";

import BoardViewModel from "../../ViewModel/Pages/boardViewModel";
import { PropertyValueList } from "../Components/propertyList";
import TaskViewModel from "../../ViewModel/Pages/taskViewModel";

export function BoardKanbanPage(boardViewModel: BoardViewModel) {
  return PropertyValueList(
    "category",
    (taskViewModel: TaskViewModel) => taskViewModel.task,
    boardViewModel.taskViewModels,
    () => <div></div>
  );
}
