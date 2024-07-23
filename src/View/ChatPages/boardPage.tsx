import * as React from "bloatless-react";

import { BoardSettingsModal } from "../Modals/boardSettingsModal";
import BoardViewModel from "../../ViewModel/Pages/boardViewModel";
import { translations } from "../translations";

export function BoardPage(boardViewModel: BoardViewModel) {
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
          <button
            class="ghost ribbon-button"
            aria-label={translations.chatPage.task.listViewButtonAudioLabel}
            on:click={boardViewModel.close}
          >
            <span class="icon">view_list</span>
          </button>
          <button
            class="ghost ribbon-button"
            aria-label={translations.chatPage.task.kanbanViewButtonAudioLabel}
            on:click={boardViewModel.showSettings}
          >
            <span class="icon">view_kanban</span>
          </button>
          <button
            class="ghost ribbon-button"
            aria-label={translations.chatPage.task.statusViewButtonAudioLabel}
            on:click={boardViewModel.showSettings}
          >
            <span class="icon">grid_view</span>
          </button>
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
      <div class="content"></div>

      {BoardSettingsModal(boardViewModel)}
    </div>
  );
}
