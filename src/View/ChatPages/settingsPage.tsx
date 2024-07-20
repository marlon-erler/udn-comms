import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/chatViewModel";
import { translations } from "../translations";

export function SettingsPage(chatViewModel: ChatViewModel) {
  return (
    <div>
      <div class="toolbar">
        <span>{translations.chatPage.settings.settingsHeadline}</span>
      </div>
      <div class="content">
        <label class="tile flex-no">
          <div>
            <span>{translations.chatPage.settings.primaryChannelLabel}</span>
            <input
              bind:value={chatViewModel.primaryChannelInput}
              on:enter={chatViewModel.setPrimaryChannel}
            ></input>
          </div>
        </label>
        <div class="flex-row justify-end width-input">
          <button
            class="width-50"
            aria-label={
              translations.chatPage.settings.setPrimaryChannelButtonAudioLabel
            }
            on:click={chatViewModel.setPrimaryChannel}
            toggle:disabled={chatViewModel.cannotSetPrimaryChannel}
          >
            {translations.general.setButton}
            <span class="icon">check</span>
          </button>
        </div>
      </div>
    </div>
  );
}
