import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/chatViewModel";
import { translations } from "../translations";

export function TaskPage(chatViewModel: ChatViewModel) {
  return (
    <div id="task-page">
      <div class="pane side">
        <div class="content">
          <div class="flex-row width-input">
            <input
              placeholder={translations.chatPage.task.newBoardNamePlaceholder}
            ></input>
            <button
              class="primary"
              aria-label={
                translations.chatPage.task.createBoardButtonAudioLabel
              }
            >
              <span class="icon">add</span>
            </button>
          </div>

          <div class="flex-row gap"></div>
        </div>
      </div>
      <div class="pane">
        <div class="toolbar">
          <span subscribe:innerText={chatViewModel.primaryChannel}></span>
        </div>
        <div class="content"></div>
      </div>
    </div>
  );
}
