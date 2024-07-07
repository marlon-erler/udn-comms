import * as React from "bloatless-react";

import { ConnectionInputView } from "./connectionSettingsView";
import { ConnectionStatusView } from "./connectionStatusView";
import { translation } from "../translations";

export function ConnectionSection() {
  return (
    <div>
        <h2>{translation.connection}</h2>
        {ConnectionStatusView()}
        <hr></hr>
        {ConnectionInputView()}
    </div>
  );
}
