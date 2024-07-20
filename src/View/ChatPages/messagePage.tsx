import "./messagePage.css";

import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/chatViewModel";

export function MessagePage(chatViewModel: ChatViewModel) {
  return (
    <div id="message-page">
      <div class="toolbar">
        <span subscribe:innerText={chatViewModel.primaryChannel}></span>
      </div>
      <div class="content">
        <div id="message-container"></div>
        <div id="composer"></div>
      </div>
    </div>
  );
}
