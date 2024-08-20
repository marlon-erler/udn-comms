import * as React from "bloatless-react";

import {
  Entry,
  EntryToOption,
  Option,
  StringToOption,
  VersionIdToOption,
} from "../Components/option";

import { DangerousActionButton } from "../Components/dangerousActionButton";
import TaskViewModel from "../../ViewModel/Pages/taskViewModel";
import { translations } from "../translations";
import { v4 } from "uuid";

export function TaskSettingsModal(taskViewModel: TaskViewModel) {
  const categorySuggestionId = v4();
  const statusSuggestionId = v4();

  const BoardOptionConverter: React.StateItemConverter<Entry> = (
    entry: Entry
  ) => {
    const isSelected = entry[0] == taskViewModel.task.boardId;
    return Option(entry[1], entry[0], isSelected);
  };

  return (
    <div class="modal" open>
      <div>
        <main>
          <h2>{translations.chatPage.task.taskSettingsHeadline}</h2>

          <label class="tile flex-no">
            <span class="icon">history</span>
            <div>
              <span>{translations.general.fileVersionLabel}</span>
              <select
                bind:value={taskViewModel.selectedVersionId}
                children:append={[taskViewModel.versionIds, VersionIdToOption]}
              ></select>
              <span class="icon">arrow_drop_down</span>
            </div>
          </label>

          <hr></hr>

          <label class="tile flex-no">
            <span class="icon">label</span>
            <div>
              <span>{translations.chatPage.task.taskNameLabel}</span>
              <input bind:value={taskViewModel.name}></input>
            </div>
          </label>

          <label class="tile flex-no">
            <span class="icon">category</span>
            <div>
              <span>{translations.chatPage.task.taskBoardLabel}</span>
              <select
                bind:value={taskViewModel.boardId}
                children:append={[
                  taskViewModel.chatViewModel.taskBoardSuggestions,
                  BoardOptionConverter,
                ]}
              ></select>
              <span class="icon">arrow_drop_down</span>
            </div>
          </label>

          <label class="tile flex-no">
            <span class="icon">description</span>
            <div>
              <span>{translations.chatPage.task.taskDescriptionLabel}</span>
              <textarea
                rows="10"
                bind:value={taskViewModel.description}
              ></textarea>
            </div>
          </label>

          <hr></hr>

          <label class="tile flex-no">
            <span class="icon">category</span>
            <div>
              <span>{translations.chatPage.task.taskCategoryLabel}</span>
              <input
                bind:value={taskViewModel.category}
                list={categorySuggestionId}
              ></input>
            </div>
          </label>
          <datalist
            hidden
            id={categorySuggestionId}
            children:append={[
              taskViewModel.coreViewModel.taskCategorySuggestions,
              StringToOption,
            ]}
          ></datalist>

          <label class="tile flex-no">
            <span class="icon">clock_loader_40</span>
            <div>
              <span>{translations.chatPage.task.taskStatusLabel}</span>
              <input
                bind:value={taskViewModel.status}
                list={statusSuggestionId}
              ></input>
            </div>
          </label>
          <datalist
            hidden
            id={statusSuggestionId}
            children:append={[
              taskViewModel.coreViewModel.taskStatusSuggestions,
              StringToOption,
            ]}
          ></datalist>

          <label class="tile flex-no">
            <span class="icon">priority_high</span>
            <div>
              <span>{translations.chatPage.task.taskPriorityLabel}</span>
              <input type="number" bind:value={taskViewModel.priority}></input>
            </div>
          </label>

          <hr></hr>

          <label class="tile flex-no">
            <span class="icon">calendar_month</span>
            <div>
              <span>{translations.chatPage.task.taskDateLabel}</span>
              <input type="date" bind:value={taskViewModel.date}></input>
            </div>
          </label>

          <label class="tile flex-no">
            <span class="icon">schedule</span>
            <div>
              <span>{translations.chatPage.task.taskTimeLabel}</span>
              <input type="time" bind:value={taskViewModel.time}></input>
            </div>
          </label>

          <hr></hr>

          <div class="width-input">
            {DangerousActionButton(
              translations.chatPage.task.deleteTaskButton,
              "delete_forever",
              taskViewModel.deleteTask
            )}
          </div>
        </main>
        <div class="flex-row width-100">
          <button class="flex" on:click={taskViewModel.closeAndDiscard}>
            {translations.general.closeButton}
          </button>
          <button class="flex primary" on:click={taskViewModel.closeAndSave}>
            {translations.general.saveButton}
            <span class="icon">save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
