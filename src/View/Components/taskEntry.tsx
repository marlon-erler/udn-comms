import * as React from "bloatless-react";

import TaskViewModel from "../../ViewModel/Pages/taskViewModel";

export function TaskEntry(taskViewModel: TaskViewModel) {
  const view = (
    <button class="tile">
      <b subscribe:innerText={taskViewModel.name}></b>
    </button>
  );

  return view;
}

export const TaskViewModelToEntry: React.StateItemConverter<TaskViewModel> = (
  taskViewModel: TaskViewModel
) => {
  return TaskEntry(taskViewModel);
};
