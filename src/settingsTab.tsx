import * as React from "bloatless-react";

import { getText } from "./translations";

export function SettingsTab() {
  return (
    <article id="settings-tab">
      <header>{getText("settings")}</header>
    </article>
  );
}
