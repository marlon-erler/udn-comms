import * as React from "bloatless-react";

import { BoardInfoToEntry } from "../Components/boardEntry";
import TaskPageViewModel from "../../ViewModel/Pages/taskPageViewModel";
import { translations } from "../translations";

export function TaskPage(taskPageViewModel: TaskPageViewModel) {
  taskPageViewModel.loadData();

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

          <hr></hr>

          <div
            class="grid gap"
            style="grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr))"
            children:append={[taskPageViewModel.boards, BoardInfoToEntry]}
          ></div>
        </div>
      </div>
      <div class="pane">
        <div class="toolbar"></div>
        <div class="content"></div>
      </div>
    </div>
  );
}
