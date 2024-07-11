import * as React from "bloatless-react";

import { isConnected, isEncryptionAvailable, zoomIn, zoomOut } from "../Model/model";

import { ChatListSection } from "../Views/Overview/chatListSection";
import { ConnectionSection } from "../Views/Overview/connectionSection";
import { PersonalSection } from "../Views/Overview/personalSection";
import { translation } from "../translations";

export function OverviewTab() {
  return (
    <article id="settings-tab" toggle:connected={isConnected}>
      <header>
        {translation.overview}
        <span>
          <button on:click={zoomOut} aria-label={translation.zoomOut}>
            <span class="icon">zoom_out</span>
          </button>
          <button on:click={zoomIn} aria-label={translation.zoomIn}>
            <span class="icon">zoom_in</span>
          </button>
        </span>
      </header>

      <div class="flex-column large-gap">
        <div class="tile error flex-no" toggle:hidden={isEncryptionAvailable}>
          <span class="icon">warning</span>
          <div>
            <b>{translation.encryptionUnavailableTitle}</b>
            <span class="secondary">
              {translation.encryptionUnavailableMessage}
            </span>
          </div>
        </div>

        {PersonalSection()}
        {ConnectionSection()}
        {ChatListSection()}
      </div>
    </article>
  );
}
