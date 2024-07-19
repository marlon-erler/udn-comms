import "./homePage.css";

import * as React from "bloatless-react";

import { translations } from "./translations";

export function HomePage() {
  // sections
  const overviewSection = (
    <div id="overview-section">
      <h2>{translations.homePage.overviewHeadline}</h2>

      <div class="tile flex-no">
        <span class="icon">cell_tower</span>
        <div>
          <b>{translations.homePage.statusHeadline}</b>
        </div>
      </div>
      <button class="tile flex-no">
        <span class="icon">settings</span>
        <div>{translations.homePage.settingsButton}</div>
      </button>

      <div class="mobile-only">
        <hr></hr>

        <div class="flex-row justify-end">
          <button class="ghost width-50" on:click={scrollToChat}>
            {translations.homePage.scrollToChatButton}
            <span class="icon">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );

  const chatSection = (
    <div id="chat-section">
      <h2>{translations.homePage.chatsHeadline}</h2>

      <div class="flex-row width-input">
        <input
          placeholder={translations.homePage.addChatPlaceholder}
          aria-label={translations.homePage.addChatAudioLabel}
        ></input>
        <button
          class="primary"
          aria-label={translations.homePage.addChatButton}
        >
          <span class="icon">add</span>
        </button>
      </div>
    </div>
  );

  // methods
  function scrollToChat() {
    chatSection.scrollIntoView();
  }

  // final
  return (
    <article id="home-page">
      <header>
        <span>{translations.homePage.appName}</span>
      </header>
      <div>
        {overviewSection}
        {chatSection}
      </div>
    </article>
  );
}
