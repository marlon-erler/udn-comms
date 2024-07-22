import * as React from "bloatless-react";

import ChatViewModel, { ChatPageType } from "../../ViewModel/Chat/chatViewModel";

export function ChatViewToggleButton(
  label: string,
  icon: string,
  page: ChatPageType,
  chatViewModel: ChatViewModel
) {
  function select() {
    chatViewModel.selectedPage.value = page;
  }

  const isSelected = React.createProxyState(
    [chatViewModel.selectedPage],
    () => chatViewModel.selectedPage.value == page
  );

  return (
    <button
      class="ghost"
      aria-label={label}
      toggle:selected={isSelected}
      on:click={select}
    >
      <span class="icon">{icon}</span>
    </button>
  );
}
