import "./homePage.css";

import * as React from "bloatless-react";

import ConnectionViewModel from "../ViewModel/connectionViewModel";
import { Option } from "./Components/option";
import SettingsViewModel from "../ViewModel/settingsViewModel";
import { translations } from "./translations";

export function HomePage(
  settingsViewModel: SettingsViewModel,
  connectionViewModel: ConnectionViewModel
) {
  // sections
  const overviewSection = (
    <div id="overview-section">
      <h2>{translations.homePage.overviewHeadline}</h2>

      <label class="tile flex-no">
        <span class="icon">cell_tower</span>
        <div>
          <span>{translations.homePage.serverAddress}</span>
          <input
            placeholder={translations.homePage.serverAddressPlaceholder}
            bind:value={connectionViewModel.serverAddressInput}
            on:enter={connectionViewModel.connect}
          ></input>
        </div>
      </label>

      <div class="flex-row">
        <button
          class="danger flex justify-center"
          aria-label={translations.homePage.disconnectAudioLabel}
          on:click={connectionViewModel.disconnect}
          toggle:disabled={connectionViewModel.cannotDisonnect}
        >
          <span class="icon">link_off</span>
        </button>
        <button
          class="flex justify-center"
          aria-label={translations.homePage.manageConnectionsAudioLabel}
          on:click={connectionViewModel.showConnectionModal}
        >
          <span class="icon">build</span>
        </button>
        <button
          class="primary flex justify-center"
          aria-label={translations.homePage.connectAudioLabel}
          on:click={connectionViewModel.connect}
          toggle:disabled={connectionViewModel.cannotConnect}
        >
          <span class="icon">link</span>
        </button>
      </div>

      <hr></hr>

      <div class="tile flex-no">
        <span class="icon">inbox</span>
        <div>
          <b>{translations.homePage.mailboxHeadline}</b>
          <span class="error">{translations.homePage.mailboxDisabled}</span>
        </div>
      </div>

      <div class="tile flex-no">
        <span class="icon">outbox</span>
        <div>
          <b>{translations.homePage.outboxHeadline}</b>
          <span class="success">
            {translations.homePage.outboxAllItemsSent}
          </span>
        </div>
      </div>

      <hr></hr>

      <label class="tile flex-no">
        <span class="icon">account_circle</span>
        <div>
          <span>{translations.homePage.yourNameLabel}</span>
          <input
            placeholder={translations.homePage.yourNamePlaceholder}
            bind:value={settingsViewModel.nameInput}
            on:enter={settingsViewModel.setName}
          ></input>
        </div>
      </label>
      <div class="flex-row justify-end">
        <button
          class="width-50"
          on:click={settingsViewModel.setName}
          toggle:disabled={settingsViewModel.cannotSetName}
        >
          {translations.homePage.setNameButton}
          <span class="icon">check</span>
        </button>
      </div>

      <hr></hr>

      <label class="tile flex-no">
        <span class="icon">calendar_month</span>
        <div>
          <span>{translations.homePage.firstDayOfWeekLabel}</span>
          <select bind:value={settingsViewModel.firstDayOfWeekInput}>
            {...translations.regional.weekdays.full.map((weekdayName, i) =>
              Option(
                weekdayName,
                i.toString(),
                i == settingsViewModel.firstDayOfWeekInput.value
              )
            )}
          </select>
          <span class="icon">arrow_drop_down</span>
        </div>
      </label>

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
