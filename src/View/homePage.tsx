import "./homePage.css";

import * as React from "bloatless-react";

import { translations } from "./translations";

export function HomePage() {
  return (
    <article id="home-page">
      <header>
        <span>{translations.homePage.appName}</span>
      </header>
      <div>
        <div id="overview-section">
          <h2>{translations.homePage.overviewHeadline}</h2>

          <div class="tile flex-no">
            <span class="icon">cell_tower</span>
            <div>
              <h3>{translations.homePage.statusHeadline}</h3>
            </div>
          </div>
          <button class="tile flex-no">
            <span class="icon">settings</span>
            <div>{translations.homePage.settingsButton}</div>
          </button>
        </div>

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
      </div>
    </article>
  );
}
