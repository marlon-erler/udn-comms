import "./messagePage.css";

import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/chatViewModel";
import { translations } from "../translations";

export function MessagePage(chatViewModel: ChatViewModel) {
  return (
    <div id="message-page">
      <div class="toolbar">
        <span subscribe:innerText={chatViewModel.primaryChannel}></span>
      </div>
      <div class="content">
        <div id="message-container"></div>
        <div id="composer">
          <input
            bind:value={chatViewModel.composingMessage}
            on:enter={chatViewModel.sendMessage}
            placeholder={translations.chatPage.message.composerInputPlaceholder}
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
  );
}
