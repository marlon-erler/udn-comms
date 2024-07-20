import "./homePage.css";

import * as React from "bloatless-react";

import ChatViewModel, { ChatPageType } from "../ViewModel/chatViewModel";

import { ChatViewToggleButton } from "./Components/chatViewToggleButton";
import { translations } from "./translations";

export function ChatPage(chatViewModel: ChatViewModel) {
  return (
    <article id="chat-page">
      <div>
        <div id="ribbon">
          <span>
            <button
              class="ghost"
              aria-label={translations.chatPage.closeChatAudioLabe}
              on:click={chatViewModel.close}
            >
              <span class="icon">close</span>
            </button>
          </span>

          <span>
            {ChatViewToggleButton(
              translations.chatPage.pages.calendar,
              "calendar_month",
              ChatPageType.Calendar,
              chatViewModel
            )}
            {ChatViewToggleButton(
              translations.chatPage.pages.progress,
              "window",
              ChatPageType.Progress,
              chatViewModel
            )}
            {ChatViewToggleButton(
              translations.chatPage.pages.kanban,
              "view_kanban",
              ChatPageType.Kanban,
              chatViewModel
            )}
            {ChatViewToggleButton(
              translations.chatPage.pages.allObjects,
              "deployed_code",
              ChatPageType.AllObjects,
              chatViewModel
            )}
            {ChatViewToggleButton(
              translations.chatPage.pages.messages,
              "forum",
              ChatPageType.Messages,
              chatViewModel
            )}
            {ChatViewToggleButton(
              translations.chatPage.pages.settings,
              "settings",
              ChatPageType.Settings,
              chatViewModel
            )}
          </span>
        </div>
        <div id="toolbar"></div>
        <div id="main"></div>
      </div>
    </article>
  );
}
