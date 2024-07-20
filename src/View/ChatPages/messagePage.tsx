import "./messagePage.css";

import * as React from "bloatless-react";

import { ChatMessageViewModelToView } from "../Components/chatMessage";
import ChatViewModel from "../../ViewModel/chatViewModel";
import { translations } from "../translations";

export function MessagePage(chatViewModel: ChatViewModel) {
  const messageContainer = (
    <div
      id="message-container"
      children:append={[
        chatViewModel.chatMessageViewModels,
        ChatMessageViewModelToView,
      ]}
    ></div>
  );

  function scrollDown() {
    console.log("down");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
  function scrollDownIfApplicable() {
    const scrollFromBottom =
      messageContainer.scrollHeight -
      (messageContainer.scrollTop + messageContainer.offsetHeight);
    if (scrollFromBottom > 400) return;

    scrollDown();
  }
  chatViewModel.chatMessageViewModels.subscribeSilent(scrollDownIfApplicable);
  setTimeout(() => scrollDown(), 100);

  return (
    <div id="message-page">
      <div class="toolbar">
        <span subscribe:innerText={chatViewModel.primaryChannel}></span>
      </div>
      <div class="content">
        {messageContainer}
        <div id="composer">
          <div class="content-width-constraint">
            <div class="input-width-constraint">
              <input
                bind:value={chatViewModel.composingMessage}
                on:enter={chatViewModel.sendMessage}
                placeholder={
                  translations.chatPage.message.composerInputPlaceholder
                }
              ></input>
              <button
                class="primary"
                aria-label={
                  translations.chatPage.message.sendMessageButtonAudioLabel
                }
                on:click={chatViewModel.sendMessage}
                toggle:disabled={chatViewModel.cannotSendMessage}
              >
                <span class="icon">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
