import * as React from "bloatless-react";

import { ConnectionSection } from "../Views/connectionSection";
import { isConnected } from "../Model/model";
import { translation } from "../translations";

export function SettingsTab() {
  return (
    <article id="settings-tab" toggle:connected={isConnected}>
      <header>{translation.overview}</header>
      <div>{ConnectionSection()}</div>
    </article>
  );
}
