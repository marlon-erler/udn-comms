import * as React from "bloatless-react";

import { BoardInfoToEntry } from "../Components/boardEntry";
import { BoardPage } from "./boardPage";
import TaskPageViewModel from "../../ViewModel/Pages/taskPageViewModel";
import { translations } from "../translations";

export function TaskPage(taskPageViewModel: TaskPageViewModel) {
  taskPageViewModel.loadData();

  const paneContent = React.createProxyState(
    [taskPageViewModel.selectedBoardId],
    () => {
      const selectedBoardId = taskPageViewModel.selectedBoardId.value;
      if (selectedBoardId == undefined) {
        return (
          <div class="pane align-center justify-center">
            <span class="secondary">
              {translations.chatPage.task.noBoardSelected}
            </span>
          </div>
        );
      }
      const selectedBoard =
        taskPageViewModel.boardViewModels.value.get(selectedBoardId);
      if (selectedBoard == undefined) {
        return (
          <div class="pane align-center justify-center">
            <span class="secondary">
              {translations.chatPage.task.boardNotFound}
            </span>
          </div>
        );
      }

      return BoardPage(selectedBoard);
    }
  );

  const listPaneWrapper = (
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
  );

  const mainPageWrapper = (
    <div class="pane-wrapper" children:set={paneContent}></div>
  );

  React.bulkSubscribe([taskPageViewModel.selectedBoardId], () => {
    const selectedBoard = taskPageViewModel.selectedBoardId.value;
    if (selectedBoard == undefined) {
      listPaneWrapper.scrollIntoView();
    } else {
      mainPageWrapper.scrollIntoView();
    }
  });

  return (
    <div id="task-page">
      {listPaneWrapper}
      {mainPageWrapper}
    </div>
  );
}
