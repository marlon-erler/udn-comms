import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/chatViewModel";

export function MessagePage(chatViewModel: ChatViewModel) {
  return (
    <div>
      <div class="toolbar">
        <span subscribe:innerText={chatViewModel.primaryChannel}></span>
      </div>
    </div>
  );
}
