import * as React from "bloatless-react";

import TaskViewModel from "../../ViewModel/Pages/taskViewModel";

export function TaskEntry(taskViewModel: TaskViewModel) {
  const view = (
    <button class="tile" on:click={taskViewModel.open}>
      <b subscribe:innerText={taskViewModel.name}></b>
    </button>
  );

  taskViewModel.index.subscribe((newIndex) => {
    view.style.order = newIndex;
  });

  return view;
}

export const TaskViewModelToEntry: React.StateItemConverter<TaskViewModel> = (
  taskViewModel: TaskViewModel
) => {
  return TaskEntry(taskViewModel);
};
