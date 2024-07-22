import * as React from "bloatless-react";

import TaskPageViewModel from "../../ViewModel/Pages/taskPageViewModel";
import { translations } from "../translations";

export function TaskPage(taskPageViewModel: TaskPageViewModel) {
  return (
    <div id="task-page">
      <div class="pane side">
        <div class="content">
          <div class="flex-row width-input">
            <input
              bind:value={taskPageViewModel.newBoardNameInput}
              on:enter={taskPageViewModel.createBoard}
              placeholder={translations.chatPage.task.newBoardNamePlaceholder}
            ></input>
            <button
              class="primary"
              aria-label={
                translations.chatPage.task.createBoardButtonAudioLabel
              }
              on:click={taskPageViewModel.createBoard}
              toggle:disabled={taskPageViewModel.cannotCreateBoard}
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
