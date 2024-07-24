import * as React from "bloatless-react";

import { DangerousActionButton } from "../Components/dangerousActionButton";
import TaskViewModel from "../../ViewModel/Pages/taskViewModel";
import { translations } from "../translations";

export function TaskSettingsModal(taskViewModel: TaskViewModel) {
  return (
    <div class="modal" open>
      <div>
        <main>
          <h2>{translations.chatPage.task.boardSettingsHeadline}</h2>

          <label class="tile flex-no">
            <span class="icon">label</span>
            <div>
              <span>{translations.chatPage.task.taskNameLabel}</span>
              <input bind:value={taskViewModel.name}></input>
            </div>
          </label>

          <label class="tile flex-no">
            <span class="icon">description</span>
            <div>
              <span>{translations.chatPage.task.taskDescriptionLabel}</span>
              <textarea rows="10" bind:value={taskViewModel.description}></textarea>
            </div>
          </label>

          <hr></hr>

          <label class="tile flex-no">
            <span class="icon">category</span>
            <div>
              <span>{translations.chatPage.task.taskCategoryLabel}</span>
              <input bind:value={taskViewModel.category}></input>
            </div>
          </label>

          <label class="tile flex-no">
            <span class="icon">clock_loader_40</span>
            <div>
              <span>{translations.chatPage.task.taskStatusLabel}</span>
              <input bind:value={taskViewModel.status}></input>
            </div>
          </label>

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
        </main>
        <div class="flex-row width-100">
          <button class="flex" on:click={taskViewModel.close}>
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
