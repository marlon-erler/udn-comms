import "./chatEntry.css";

import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/Chat/chatViewModel";

export function ChatEntry(chatViewModel: ChatViewModel) {
  const view = (
    <button set:color={chatViewModel.color} class="chat-entry tile" on:click={chatViewModel.open}>
      <span
        class="shadow"
        subscribe:innerText={chatViewModel.primaryChannel}
      ></span>
      <h2 subscribe:innerText={chatViewModel.primaryChannel}></h2>
    </button>
  );

  chatViewModel.index.subscribe((newIndex) => {
    view.style.order = newIndex;
  });

  return view;
}

export const ChatViewModelToChatEntry: React.StateItemConverter<
  ChatViewModel
> = (chatViewModel: ChatViewModel) => {
  return ChatEntry(chatViewModel);
};
