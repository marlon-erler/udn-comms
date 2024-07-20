import * as React from "bloatless-react";

import ChatMessageViewModel from "../../Model/chatMessageViewModel";

export function ChatMessage(chatMessageViewModel: ChatMessageViewModel) {
  return (
    <div class="tile flex-no">
      <div>
        <span>{chatMessageViewModel.sender}</span>
        <b subscribe:innerText={chatMessageViewModel.body}></b>
        <span>{chatMessageViewModel.dateSent}</span>
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
