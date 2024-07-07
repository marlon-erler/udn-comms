import * as React from "bloatless-react";

import { CommunicationSection } from "../Views/communicationSection";
import { ConnectionSection } from "../Views/connectionSection";
import { EncryptionSection } from "../Views/encryptionSection";
import { isConnected } from "../model";
import { translation } from "../translations";

export function SettingsTab() {
  return (
    <article id="settings-tab" toggle:connected={isConnected}>
      <header>{translation.settings}</header>
      <div>
        {ConnectionSection()}
        {CommunicationSection()}
        {EncryptionSection()}
        <hr class="mobile-only"></hr>
        <a
          href="#message-tab"
          class="mobile-only width-100 flex-row justify-end control-gap"
        >
          {translation.messages}
          <span class="icon">arrow_forward</span>
        </a>
      </div>
    </article>
  );
}
