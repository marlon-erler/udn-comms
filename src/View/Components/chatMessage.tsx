import * as React from "bloatless-react";

import { ChatMessageInfoModal } from "./chatMessageInfoModal";
import { ChatMessageStatus } from "../../Model/Chat/chatModel";
import ChatMessageViewModel from "../../ViewModel/chatMessageViewModel";
import { translations } from "../translations";

export function ChatMessage(chatMessageViewModel: ChatMessageViewModel) {
  const isInfoModalOpen = new React.State(false);
  function openModal() {
    isInfoModalOpen.value = true;
  }

  const statusIcon = React.createProxyState(
    [chatMessageViewModel.status],
    () => {
      switch (chatMessageViewModel.status.value) {
        case ChatMessageStatus.Outbox:
          return "hourglass_top";
        case ChatMessageStatus.Sent:
          return "check";
        case ChatMessageStatus.Received:
          return "done_all";
        default:
          return "warning";
      }
    }
  );

  return (
    <div
      class="message-bubble"
      toggle:sentbyuser={chatMessageViewModel.sentByUser}
    >
      <div class="main tile">
        <div class="text-container">
          <span class="sender-name ellipsis">
            {chatMessageViewModel.sender}
          </span>
          <span
            class="body"
            subscribe:innerText={chatMessageViewModel.body}
          ></span>
          <span class="timestamp ellipsis">
            <span class="icon" subscribe:innerText={statusIcon}></span>
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
