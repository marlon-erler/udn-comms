import * as React from "bloatless-react";

import {
  TaskCategoryBulkChangeViewModel,
  TaskStatusBulkChangeViewModel,
} from "../../ViewModel/Utility/taskPropertyBulkChangeViewModel";

import BoardViewModel from "../../ViewModel/Pages/boardViewModel";
import { FilteredList } from "../Components/filteredList";
import { PropertyValueList } from "../Components/propertyList";
import TaskViewModel from "../../ViewModel/Pages/taskViewModel";
import { TaskViewModelToEntry } from "../Components/taskEntry";
import { collectObjectValuesForKey } from "../../Model/Utility/utility";
import { translations } from "../translations";

export function BoardStatusGridPage(boardViewModel: BoardViewModel) {
  const categoryRowConverter: React.StateItemConverter<string> = (
    categoryName: string
  ) => {
    return CategoryRow(categoryName, statuses, boardViewModel);
  };

  const statusNameCellConverter: React.StateItemConverter<string> = (
    statusName: string
  ) => {
    return StatusNameCell(statusName, boardViewModel);
  };

  const statuses: React.ListState<string> = new React.ListState();
  boardViewModel.taskViewModels.subscribe(() => {
    statuses.clear();
    const statusArray: string[] = collectObjectValuesForKey(
      "status",
      (taskViewModel: TaskViewModel) => taskViewModel.task,
      [...boardViewModel.taskViewModels.value.values()]
    );
    statuses.add(...statusArray);
  });

  return (
    <div class="status-page-content">
      <div
        class="status-name-row"
        children:append={[statuses, statusNameCellConverter]}
      ></div>
      {PropertyValueList(
        "category",
        (taskViewModel: TaskViewModel) => taskViewModel.task,
        boardViewModel.filteredTaskViewModels,
        (categories: React.ListState<string>) => {
          return (
            <div
              class="status-grid-wrapper"
              children:append={[categories, categoryRowConverter]}
            ></div>
          );
        }
      )}
    </div>
  );
}

function StatusNameCell(statusName: string, boardViewModel: BoardViewModel) {
  const taskViewModelsWithMatchingStatus: React.ListState<TaskViewModel> =
    new React.ListState();

  boardViewModel.taskViewModels.handleAddition(
    (taskViewModel: TaskViewModel) => {
      const doesMatchStatus: boolean = taskViewModel.task.status == statusName;
      if (doesMatchStatus == false) return;

      taskViewModelsWithMatchingStatus.add(taskViewModel);
      boardViewModel.taskViewModels.handleRemoval(taskViewModel, () => {
        taskViewModelsWithMatchingStatus.remove(taskViewModel);
      });
    }
  );

  const viewModel: TaskStatusBulkChangeViewModel =
    new TaskStatusBulkChangeViewModel(
      taskViewModelsWithMatchingStatus,
      statusName
    );

  return (
    <div class="flex-row">
      <div class="property-input-wrapper">
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
    </div>
  );
}

function CategoryRow(
  categoryName: string,
  allStatuses: React.ListState<string>,
  boardViewModel: BoardViewModel
) {
  return FilteredList(
    { category: categoryName },
    (taskViewModel: TaskViewModel) => taskViewModel.task,
    boardViewModel.taskViewModels,
    (taskViewModels: React.ListState<TaskViewModel>) => {
      const statusNameConverter: React.StateItemConverter<string> = (
        statusName: string
      ) => {
        return CategoryStatusColumn(statusName, taskViewModels);
      };

      const viewModel: TaskCategoryBulkChangeViewModel =
        new TaskCategoryBulkChangeViewModel(taskViewModels, categoryName);

      return (
        <div class="flex-row flex-no large-gap">
          <div class="property-input-wrapper">
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

          <div
            class="flex-row large-gap padding-right"
            children:append={[allStatuses, statusNameConverter]}
          ></div>
        </div>
      );
    }
  );
}

function CategoryStatusColumn(
  statusName: string,
  taskViewModelsWithMatchingCategory: React.ListState<TaskViewModel>
) {
  const taskViewModels: React.ListState<TaskViewModel> = new React.ListState();

  taskViewModelsWithMatchingCategory.handleAddition((taskViewModel) => {
    const doesMatchStatus: boolean = taskViewModel.status.value == statusName;
    if (doesMatchStatus == false) return;

    taskViewModels.add(taskViewModel);
    taskViewModelsWithMatchingCategory.handleRemoval(taskViewModel, () => {
      taskViewModels.remove(taskViewModel);
    });
  });

  return (
    <div
      class="status-column gap"
      children:append={[taskViewModels, TaskViewModelToEntry]}
    ></div>
  );
}
