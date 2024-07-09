import * as React from "bloatless-react";

import { ChatListSection } from "../Views/chatListSection";
import { ConnectionSection } from "../Views/connectionSection";
import { isConnected } from "../Model/model";
import { translation } from "../translations";

export function SettingsTab() {
  return (
    <article id="settings-tab" toggle:connected={isConnected}>
      <header>{translation.overview}</header>
      <div class="flex-column large-gap">
        {ConnectionSection()}
        {ChatListSection()}
      </div>
    </article>
  );
}
