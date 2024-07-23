import * as React from "bloatless-react";

import BoardViewModel from "../../ViewModel/Pages/boardViewModel";
import { translations } from "../translations";

export function BoardSettingsModal(boardViewModel: BoardViewModel) {
  return (
    <div class="modal" toggle:open={boardViewModel.isPresentingSettingsModal}>
      <div>
        <main>
          <h2>{translations.chatPage.message.messageInfoHeadline}</h2>
        </main>
        <button
          on:click={boardViewModel.hideSettings}
        >
          {translations.general.closeButton}
          <span class="icon">close</span>
        </button>
      </div>
    </div>
  );
}
