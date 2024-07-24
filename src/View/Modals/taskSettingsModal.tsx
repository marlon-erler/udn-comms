import * as React from "bloatless-react";

import { DangerousActionButton } from "../Components/dangerousActionButton";
import TaskViewModel from "../../ViewModel/Pages/taskViewModel";
import { translations } from "../translations";

export function TaskSettingsModal(taskViewModal: TaskViewModel) {
  return (
    <div class="modal" toggle:open={taskViewModal.isPresentingSettingsModal}>
      <div>
        <main>
          <h2>{translations.chatPage.task.boardSettingsHeadline}</h2>

          <div class="tile flex-no">
            <span class="icon">label</span>
            <div>
              <span>{translations.chatPage.task.taskNameLabel}</span>
              <input bind:value={taskViewModal.name}></input>
            </div>
          </div>

          <div class="tile flex-no">
            <span class="icon">description</span>
            <div>
              <span>{translations.chatPage.task.taskDescriptionLabel}</span>
              <input bind:value={taskViewModal.description}></input>
            </div>
          </div>

          <hr></hr>

          <div class="tile flex-no">
            <span class="icon">category</span>
            <div>
              <span>{translations.chatPage.task.taskCategoryLabel}</span>
              <input bind:value={taskViewModal.category}></input>
            </div>
          </div>

          <div class="tile flex-no">
            <span class="icon">clock_loader_40</span>
            <div>
              <span>{translations.chatPage.task.taskStatusLabel}</span>
              <input bind:value={taskViewModal.status}></input>
            </div>
          </div>

          <div class="tile flex-no">
            <span class="icon">priority_high</span>
            <div>
              <span>{translations.chatPage.task.taskPriorityLabel}</span>
              <input type="number" bind:value={taskViewModal.priority}></input>
            </div>
          </div>

          <hr></hr>

          <div class="tile flex-no">
            <span class="icon">calendar_month</span>
            <div>
              <span>{translations.chatPage.task.taskDateLabel}</span>
              <input type="date" bind:value={taskViewModal.date}></input>
            </div>
          </div>

          <div class="tile flex-no">
            <span class="icon">schedule</span>
            <div>
              <span>{translations.chatPage.task.taskTimeLabel}</span>
              <input type="time" bind:value={taskViewModal.time}></input>
            </div>
          </div>
        </main>
        <div class="flex-row">
          <button class="flex-1" on:click={taskViewModal.hideSettings}>
            {translations.general.closeButton}
            <span class="icon">close</span>
          </button>
          <button class="flex-1" on:click={taskViewModal.hideSettingsAndSave}>
            {translations.general.saveButton}
            <span class="icon">save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
