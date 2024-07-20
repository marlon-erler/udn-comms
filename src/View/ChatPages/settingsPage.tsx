import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/chatViewModel";
import { Color } from "../../ViewModel/colors";
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

        <hr></hr>

        <div
          class="flex-row gap width-input"
        >
          {...Object.values(Color).map((color) => {
            const isSelected = React.createProxyState(
              [chatViewModel.color],
              () => chatViewModel.color.value == color
            );

            function setColor() {
              chatViewModel.setColor(color);
            }

            return (
              <button
                color={color}
                class="fill-color width-100 flex"
                style="height: 2rem"
                toggle:selected={isSelected}
                on:click={setColor}
              ></button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
