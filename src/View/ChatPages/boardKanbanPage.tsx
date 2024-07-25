import * as React from "bloatless-react";

import BoardViewModel from "../../ViewModel/Pages/boardViewModel";
import { FilteredList } from "../Components/filteredList";
import { PropertyValueList } from "../Components/propertyValueList";
import { TaskCategoryBulkChangeViewModel } from "../../ViewModel/Utility/taskPropertyBulkChangeViewModel";
import TaskViewModel from "../../ViewModel/Pages/taskViewModel";
import { TaskViewModelToEntry } from "../Components/taskEntry";
import { allowDrop } from "../utility";
import { translations } from "../translations";

export function BoardKanbanPage(boardViewModel: BoardViewModel) {
  const categoryNameConverter: React.StateItemConverter<string> = (
    categoryName: string
  ) => {
    return KanbanBoard(categoryName, boardViewModel);
  };

  return PropertyValueList(
    "category",
    (taskViewModel: TaskViewModel) => taskViewModel.task,
    boardViewModel.taskViewModels,
    (categories: React.ListState<string>) => {
      return (
        <div
          class="kanban-board-wrapper"
          children:append={[categories, categoryNameConverter]}
        ></div>
      );
    }
  );
}

function KanbanBoard(categoryName: string, boardViewModel: BoardViewModel) {
  return FilteredList(
    { category: categoryName },
    (taskViewModel: TaskViewModel) => taskViewModel.task,
    boardViewModel.filteredTaskViewModels,
    (taskViewModels: React.ListState<TaskViewModel>) => {
      const viewModel: TaskCategoryBulkChangeViewModel =
        new TaskCategoryBulkChangeViewModel(taskViewModels, categoryName);

      function drop() {
        boardViewModel.handleDropWithinBoard(categoryName);
      }

      return (
        <div class="flex-column flex-no" on:dragover={allowDrop} on:drop={drop}>
          <div class="flex-row width-input">
            <input
              placeholder={
                translations.chatPage.task.renameCategoryInputPlaceholder
              }
              bind:value={viewModel.inputValue}
              on:enter={viewModel.set}
            ></input>
            <button
              class="primary"
              on:click={viewModel.set}
              toggle:disabled={viewModel.cannotSet}
            >
              <span class="icon">check</span>
            </button>
          </div>

          <hr></hr>

          <div
            class="kanban-column"
            children:append={[taskViewModels, TaskViewModelToEntry]}
          ></div>
        </div>
      );
    }
  );
}
