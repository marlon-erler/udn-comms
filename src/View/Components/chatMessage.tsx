import * as React from "bloatless-react";

import ChatMessageViewModel from "../../Model/chatMessageViewModel";

export function ChatMessage(chatMessageViewModel: ChatMessageViewModel) {
  return (
    <div
      class="message-bubble"
      toggle:sentbyuser={chatMessageViewModel.sentByUser}
    >
      <div>
        <span class="sender-name">{chatMessageViewModel.sender}</span>
        <span
          class="body"
          subscribe:innerText={chatMessageViewModel.body}
        ></span>
        <span class="timestamp">{chatMessageViewModel.dateSent}</span>
      </div>
    </div>
  );
}

export const ChatMessageViewModelToView: React.StateItemConverter<
  ChatMessageViewModel
> = (chatMessageViewModel: ChatMessageViewModel) => {
  console.log(chatMessageViewModel);
  return ChatMessage(chatMessageViewModel);
};
