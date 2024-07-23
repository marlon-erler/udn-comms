import * as React from "bloatless-react";

import BoardViewModel, {
  BoardPageType,
} from "../../ViewModel/Pages/boardViewModel";

import { BoardSettingsModal } from "../Modals/boardSettingsModal";
import { BoardViewToggleButton } from "../Components/boardViewToggleButton";
import { translations } from "../translations";

export function BoardPage(boardViewModel: BoardViewModel) {
  boardViewModel.loadData();

  const mainContent = React.createProxyState(
    [boardViewModel.selectedPage],
    () => {
      switch (boardViewModel.selectedPage.value) {
        default: {
          return <div></div>;
        }
      }
    }
  );

  return (
    <div class="pane">
      <div class="toolbar">
        <span>
          <button
            class="ghost"
            aria-label={translations.chatPage.task.closeBoard}
            on:click={boardViewModel.close}
          >
            <span class="icon">arrow_back</span>
          </button>
          <button
            class="ghost"
            aria-label={translations.chatPage.task.boardSettingsHeadline}
            on:click={boardViewModel.showSettings}
          >
            <span class="icon">settings</span>
          </button>
        </span>
        <span class="scroll-h ribbon">
          {BoardViewToggleButton(
            translations.chatPage.task.listViewButtonAudioLabel,
            "view_list",
            BoardPageType.List,
            boardViewModel
          )}
          {BoardViewToggleButton(
            translations.chatPage.task.kanbanViewButtonAudioLabel,
            "view_kanban",
            BoardPageType.Kanban,
            boardViewModel
          )}
          {BoardViewToggleButton(
            translations.chatPage.task.statusViewButtonAudioLabel,
            "grid_view",
            BoardPageType.StatusGrid,
            boardViewModel
          )}
        </span>
        <span>
          <button
            class="ghost"
            aria-label={translations.chatPage.task.filterTasksButtonAudioLabel}
            on:click={boardViewModel.showFilterModal}
          >
            <span class="icon">filter_alt</span>
          </button>
          <button
            class="primary"
            aria-label={translations.chatPage.task.createTaskButtonAudioLabel}
            on:click={boardViewModel.showNewTaskModal}
          >
            <span class="icon">add</span>
          </button>
        </span>
      </div>
      <div class="content" children:set={mainContent}></div>

      {BoardSettingsModal(boardViewModel)}
    </div>
  );
}
