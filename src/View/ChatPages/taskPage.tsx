import * as React from "bloatless-react";

import { ChatMessageViewModelToView } from "../Components/chatMessage";
import ChatViewModel from "../../ViewModel/chatViewModel";
import { translations } from "../translations";

export function TaskPage(chatViewModel: ChatViewModel) {
  return (
    <div id="task-page">
      <div class="pane side">
        <div class="toolbar">
          <span subscribe:innerText={chatViewModel.primaryChannel}></span>
        </div>
        <div class="content"></div>
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
