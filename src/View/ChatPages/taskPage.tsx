import * as React from "bloatless-react";

import { BoardInfoToEntry } from "../Components/boardEntry";
import { BoardPage } from "./boardPage";
import TaskPageViewModel from "../../ViewModel/Pages/taskPageViewModel";
import { translations } from "../translations";

export function TaskPage(taskPageViewModel: TaskPageViewModel) {
  taskPageViewModel.loadData();

  const paneContent = React.createProxyState(
    [taskPageViewModel.selectedBoard],
    () => {
      const selectedBoard = taskPageViewModel.selectedBoard.value;
      if (selectedBoard == undefined) {
        return [
          <div class="pane align-center justify-center">
            <span class="secondary">
              {translations.chatPage.task.noBoardSelected}
            </span>
          </div>,
        ];
      } else {
        return BoardPage(selectedBoard);
      }
    }
  );

  return (
    <div id="task-page">
      <div class="pane-wrapper side">
        <div class="pane">
          <div class="toolbar">
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
          </div>
          <div class="content">
            <div
              class="grid gap"
              style="grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr))"
              children:append={[
                taskPageViewModel.boardViewModels,
                BoardInfoToEntry,
              ]}
            ></div>
          </div>
        </div>
      </div>

      <div class="pane-wrapper" children:set={paneContent}></div>
    </div>
  );
}
