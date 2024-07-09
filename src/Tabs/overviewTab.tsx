import * as React from "bloatless-react";

import { isConnected, isEncryptionAvailable } from "../Model/model";

import { ChatListSection } from "../Views/chatListSection";
import { ConnectionSection } from "../Views/connectionSection";
import { translation } from "../translations";

export function OverviewTab() {
  return (
    <article id="settings-tab" toggle:connected={isConnected}>
      <header>{translation.overview}</header>

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

        {ConnectionSection()}
        {ChatListSection()}
      </div>
    </article>
  );
}
