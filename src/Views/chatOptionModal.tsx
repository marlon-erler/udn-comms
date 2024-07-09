import * as React from "bloatless-react";

import { Chat } from "../Model/chatModel";
import { translation } from "../translations";

export function ChatOptionModal(chat: Chat, isPresented: React.State<boolean>) {
  function closeModal() {
    isPresented.value = false;
  }

  function deleteChat() {
    chat.deleteSelf();
    closeModal();
  }

  const shouldShowKey = new React.State(false);
  const inputType = React.createProxyState([shouldShowKey], () =>
    shouldShowKey.value == true ? "text" : "password"
  );

  const secondaryChannelConverter: React.ListItemConverter<string> = (
    secondaryChannel
  ) => {
    function remove() {
      chat.removeSecondaryChannel(secondaryChannel);
    }

    return (
      <div class="tile width-input padding-0">
        <div class="flex-row justify-apart align-center">
          <b class="padding-h">{secondaryChannel}</b>
          <button
            class="danger"
            aria-label={translation.removeSecondaryChannel}
            on:click={remove}
          >
            <span class="icon">delete</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div class="modal" toggle:open={isPresented}>
      <div>
        <main>
          <h2>{translation.configureChatTitle}</h2>

          <div>
            <label class="tile">
              <span class="icon">forum</span>
              <div>
                <span>{translation.primaryChannel}</span>
                <input
                  bind:value={chat.primaryChannelInput}
                  placeholder={translation.primaryChannelPlaceholder}
                  on:enter={chat.setChannel}
                ></input>
              </div>
            </label>
            <div class="flex-row width-input">
              <button
                aria-label={translation.undoChanges}
                class="flex justify-center"
                on:click={chat.undoChannelChange}
                toggle:disabled={chat.cannotUndoChannel}
              >
                <span class="icon">undo</span>
              </button>
              <button
                aria-label={translation.set}
                class="flex justify-center primary"
                on:click={chat.setChannel}
                toggle:disabled={chat.cannotSetChannel}
              >
                <span class="icon">check</span>
              </button>
            </div>
          </div>

          <hr></hr>

          <div class="flex-row margin-bottom width-input">
            <input
              aria-label={translation.secondaryChannel}
              placeholder={translation.secondaryChannelPlaceholder}
              bind:value={chat.newSecondaryChannelName}
              on:enter={chat.addSecondaryChannel}
            ></input>
            <button
              class="primary"
              toggle:disabled={chat.cannotAddSecondaryChannel}
              aria-label={translation.addSecondaryChannel}
              on:click={chat.addSecondaryChannel}
            >
              <span class="icon">add</span>
            </button>
          </div>

          <div
            class="flex-column gap"
            children:prepend={[
              chat.secondaryChannels,
              secondaryChannelConverter,
            ]}
          ></div>

          <hr></hr>

          <div>
            <label class="tile">
              <span class="icon">key</span>
              <div>
                <span>{translation.encryptionKey}</span>
                <input
                  placeholder={translation.encryptionKeyPlaceholder}
                  bind:value={chat.encryptionKey}
                  set:type={inputType}
                ></input>
              </div>
            </label>

            <label class="inline margin-0">
              <input type="checkbox" bind:checked={shouldShowKey}></input>
              {translation.showKey}
            </label>
          </div>

          <hr></hr>

          <div class="flex-column gap">
            <button class="danger" on:click={chat.clearMessages}>
              {translation.clearChatMessages}
              <span class="icon">delete_sweep</span>
            </button>

            <button class="danger" on:click={deleteChat}>
              {translation.removeChat}
              <span class="icon">delete</span>
            </button>
          </div>
        </main>
        <button on:click={closeModal}>
          {translation.close}
          <span class="icon">close</span>
        </button>
      </div>
    </div>
  );
}
