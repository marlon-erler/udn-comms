import * as React from "bloatless-react";

import ChatMessageViewModel from "../../Model/chatMessageViewModel";

export function ChatMessage(chatMessageViewModel: ChatMessageViewModel) {
  return (
    <div
      class="message-bubble"
      toggle:sentbyuser={chatMessageViewModel.sentByUser}
    >
      <div>
        <span class="sender-name ellipsis">{chatMessageViewModel.sender}</span>
        <span
          class="body"
          subscribe:innerText={chatMessageViewModel.body}
        ></span>
        <span class="timestamp ellipsis">{chatMessageViewModel.dateSent}</span>
      </div>
    </div>
  );
}

export const ChatMessageViewModelToView: React.StateItemConverter<
  ChatMessageViewModel
> = (chatMessageViewModel: ChatMessageViewModel) => {
  return ChatMessage(chatMessageViewModel);
};
