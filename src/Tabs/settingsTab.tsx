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
      </div>
    </article>
  );
}
