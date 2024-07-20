import "./homePage.css";

import * as React from "bloatless-react";

import ChatViewModel from "../ViewModel/chatViewModel";
import { translations } from "./translations";

export function ChatPage(chatViewModel: ChatViewModel) {
  return (
    <article id="chat-page">
      <div>
        <div id="ribbon">
          <button
            aria-label={translations.chatPage.closeChatAudioLabe}
            on:click={chatViewModel.close}
          >
            <span class="icon">close</span>
          </button>
          <span></span>
        </div>
        <div id="toolbar"></div>
        <div id="main"></div>
      </div>
    </article>
  );
}
