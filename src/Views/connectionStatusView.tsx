import * as React from "bloatless-react";

import { connectionMessage } from "../model";
import { translation } from "../translations";

export function ConnectionStatusView() {
  return (
    <div class="tile width-input">
      <div>
        <b>{translation.connectionStatus}</b>
        <span
          class="success connected-only"
          subscribe:innerText={connectionMessage}
        ></span>
        <span class="error disconnected-only">{translation.disconnected}</span>
      </div>
    </div>
  );
}
