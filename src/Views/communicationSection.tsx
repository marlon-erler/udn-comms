import * as React from "bloatless-react";

import {
  Channel,
  addSecondaryChannel,
  cannotAddSecondaryChannel,
  cannotSetChannel,
  newSecondaryChannelName,
  primaryChannel,
  removeSecondaryChannel,
  secondaryChannels,
  senderName,
  setChannel,
} from "../model";

import { translation } from "../translations";

const secondaryChannelConverter: React.ListItemConverter<Channel> = (
  channel
) => {
  function remove() {
    removeSecondaryChannel(channel);
  }

  return (
    <div class="tile padding-0">
      <div class="flex-row justify-apart align-center">
        <b class="padding-h">{channel.channelName}</b>

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

export function CommunicationSection() {
  return (
    <div>
      <h2>{translation.communication}</h2>

      <label class="tile">
        <span class="icon">account_circle</span>
        <div>
          <span>{translation.yourName}</span>
          <input
            bind:value={senderName}
            placeholder={translation.yourNamePlaceholder}
          ></input>
        </div>
      </label>

      <hr></hr>

      <label class="tile">
        <span class="icon">forum</span>
        <div>
          <span>{translation.primaryChannel}</span>
          <input
            bind:value={primaryChannel}
            on:enter={setChannel}
            placeholder={translation.channelPlaceholder}
          ></input>
        </div>
      </label>
      <div class="flex-row width-input justify-end">
        <button
          class="primary width-50"
          on:click={setChannel}
          toggle:disabled={cannotSetChannel}
        >
          {translation.setInput}
          <span class="icon">check</span>
        </button>
      </div>

      <hr></hr>

      <div class="flex-row width-input margin-bottom">
        <input
          bind:value={newSecondaryChannelName}
          on:enter={addSecondaryChannel}
          placeholder={translation.newSecondaryChannelPlaceholder}
          class="width-100 flex"
        ></input>
        <button
          class="primary"
          on:click={addSecondaryChannel}
          toggle:disabled={cannotAddSecondaryChannel}
          aria-label={translation.addSecondaryChannel}
        >
          <span class="icon">add</span>
        </button>
      </div>

      <div
        class="flex-column gap"
        subscribe:children={[secondaryChannels, secondaryChannelConverter]}
      ></div>
    </div>
  );
}
