import * as React from "bloatless-react";

import TaskViewModel from "../../ViewModel/Files/taskViewModel";
import { translations } from "../translations";

export function TaskPage(taskViewModel: TaskViewModel) {
  return (
    <div id="task-page">
      <div class="pane side">
        <div class="content">
          <div class="flex-row width-input">
            <input
              bind:value={taskViewModel.newBoardNameInput}
              on:enter={taskViewModel.createBoard}
              placeholder={translations.chatPage.task.newBoardNamePlaceholder}
            ></input>
            <button
              class="primary"
              aria-label={
                translations.chatPage.task.createBoardButtonAudioLabel
              }
              on:click={taskViewModel.createBoard}
              toggle:disabled={taskViewModel.cannotCreateBoard}
            >
              <span class="icon">add</span>
            </button>
          </div>

          <div class="flex-row gap"></div>
        </div>
      </div>
      <div class="pane">
        <div class="toolbar"></div>
        <div class="content"></div>
      </div>
    </div>
  );
}
