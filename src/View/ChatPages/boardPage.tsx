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
        <span>a</span>
        <span>b</span>
      </div>
      <div class="content"></div>

      {BoardSettingsModal(boardViewModel)}
    </div>
  );
}
