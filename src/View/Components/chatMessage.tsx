import * as React from "bloatless-react";

import { ChatMessageInfoModal } from "./chatMessageInfoModal";
import ChatMessageViewModel from "../../Model/chatMessageViewModel";
import { translations } from "../translations";

export function ChatMessage(chatMessageViewModel: ChatMessageViewModel) {
  const isInfoModalOpen = new React.State(false);
  function openModal() {
    isInfoModalOpen.value = true;
  }

  return (
    <div
      class="message-bubble"
      toggle:sentbyuser={chatMessageViewModel.sentByUser}
    >
      <div class="main">
        <div class="text-container">
          <span class="sender-name ellipsis">
            {chatMessageViewModel.sender}
          </span>
          <span
            class="body"
            subscribe:innerText={chatMessageViewModel.body}
          ></span>
          <span class="timestamp ellipsis">
            {chatMessageViewModel.dateSent}
          </span>
        </div>
        <div class="button-container">
          <button
            on:click={openModal}
            aria-label={
              translations.chatPage.message.showMessageInfoButtonAudioLabel
            }
          >
            <span class="icon">info</span>
          </button>
        </div>
      </div>

      {ChatMessageInfoModal(chatMessageViewModel, isInfoModalOpen)}
    </div>
  );
}

export const ChatMessageViewModelToView: React.StateItemConverter<
  ChatMessageViewModel
> = (chatMessageViewModel: ChatMessageViewModel) => {
  return ChatMessage(chatMessageViewModel);
};
