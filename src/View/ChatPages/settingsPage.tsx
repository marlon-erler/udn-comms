import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/chatViewModel";
import { Color } from "../../ViewModel/colors";
import { DeletableListItem } from "../Components/deletableListItem";
import { translations } from "../translations";

export function SettingsPage(chatViewModel: ChatViewModel) {
  const secondaryChannelConverter: React.StateItemConverter<string> = (
    secondaryChannel: string
  ) => {
    return DeletableListItem(secondaryChannel, <span></span>, () => {
      chatViewModel.removeSecondaryChannel(secondaryChannel);
    });
  };

  return (
    <div>
      <div class="toolbar">
        <span>{translations.chatPage.settings.settingsHeadline}</span>
      </div>
      <div class="content">
        <label class="tile flex-no">
          <span class="icon">forum</span>
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

        <div class="flex-row width-input margin-bottom">
          <input
            aria-label={
              translations.chatPage.settings.newSecondaryChannelAudioLabel
            }
            placeholder={
              translations.chatPage.settings.newSecondaryChannelPlaceholder
            }
            bind:value={chatViewModel.newSecondaryChannelInput}
            on:enter={chatViewModel.addSecondaryChannel}
          ></input>
          <button
            class="primary"
            aria-label={
              translations.chatPage.settings.addSecondaryChannelButtonAudioLabel
            }
            on:click={chatViewModel.addSecondaryChannel}
          >
            <span class="icon">add</span>
          </button>
        </div>

        <div
          class="flex-column gap width-input"
          children:append={[
            chatViewModel.secondaryChannels,
            secondaryChannelConverter,
          ]}
        ></div>

        <hr></hr>

        <label class="tile flex-no">
          <span class="icon">key</span>
          <div>
            <span>{translations.chatPage.settings.encryptionKeyLabel}</span>
            <input
              bind:value={chatViewModel.encryptionKeyInput}
              on:enter={chatViewModel.setEncryptionKey}
              set:type={chatViewModel.encryptionKeyInputType}
            ></input>
          </div>
        </label>
        <div class="flex-row justify-end width-input">
          <button
            class="width-50"
            aria-label={
              translations.chatPage.settings.setEncryptionKeyButtonAudioLabel
            }
            on:click={chatViewModel.setEncryptionKey}
            toggle:disabled={chatViewModel.cannotSetEncryptionKey}
          >
            {translations.general.setButton}
            <span class="icon">check</span>
          </button>
        </div>

        <label class="inline">
          <input
            type="checkbox"
            bind:checked={chatViewModel.shouldShowEncryptionKey}
          ></input>
          {translations.chatPage.settings.showEncryptionKey}
        </label>

        <hr></hr>

        <div class="flex-row gap width-input">
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
