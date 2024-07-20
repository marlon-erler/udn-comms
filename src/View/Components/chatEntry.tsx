import "./chatEntry.css";

import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/chatViewModel";

export function ChatEntry(chatViewModel: ChatViewModel) {
  return (
    <button class="chat-entry tile" on:click={chatViewModel.open}>
      <span
        class="shadow"
        subscribe:innerText={chatViewModel.primaryChannel}
      ></span>
      <h2 subscribe:innerText={chatViewModel.primaryChannel}></h2>
    </button>
  );
}

export const ChatViewModelToChatEntry: React.StateItemConverter<
  ChatViewModel
> = (chatViewModel: ChatViewModel) => {
  return ChatEntry(chatViewModel);
};
