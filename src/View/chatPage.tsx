import "./homePage.css";

import * as React from "bloatless-react";

import ChatViewModel, { ChatPageType } from "../ViewModel/Chat/chatViewModel";

import { ChatViewToggleButton } from "./Components/chatViewToggleButton";
import { MessagePage } from "./ChatPages/messagePage";
import { SettingsPage } from "./ChatPages/settingsPage";
import { TaskPage } from "./ChatPages/taskPage";
import { translations } from "./translations";

export function ChatPage(chatViewModel: ChatViewModel) {
  const mainContent = new React.State(<div></div>);

  chatViewModel.selectedPage.subscribe((selectedPage) => {
    chatViewModel.closeSubPages();

    switch (selectedPage) {
      case ChatPageType.Settings: {
        mainContent.value = SettingsPage(chatViewModel.settingsPageViewModel);
        break;
      }
      case ChatPageType.Tasks: {
        mainContent.value = TaskPage(chatViewModel.taskPageViewModel);
        break;
      }
      default: {
        mainContent.value = MessagePage(chatViewModel.messagePageViewModel);
      }
    }
  });

  return (
    <article
      id="chat-page"
      set:color={chatViewModel.displayedColor}
      class="subtle-background"
    >
      <div>
        <div id="ribbon">
          <button
            class="ghost"
            aria-label={translations.chatPage.closeChatAudioLabe}
            on:click={chatViewModel.close}
          >
            <span class="icon">close</span>
          </button>

          <span>
            {ChatViewToggleButton(
              translations.chatPage.pages.calendar,
              "calendar_month",
              ChatPageType.Calendar,
              chatViewModel
            )}
            {ChatViewToggleButton(
              translations.chatPage.pages.tasks,
              "task_alt",
              ChatPageType.Tasks,
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
        <div id="main" children:set={mainContent}></div>
      </div>
    </article>
  );
}
