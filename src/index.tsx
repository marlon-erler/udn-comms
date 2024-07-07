import * as React from "bloatless-react";

import { getText } from "./translations";

document.body.prepend(
  <menu>
    <a class="tab-link" href="#settings-tab" active>
      <span class="icon">settings</span>
      {getText("settings")}
    </a>
    <a class="tab-link" href="#message-tab">
      <span class="icon">forum</span>
      {getText("messages")}
    </a>
  </menu>
);
document.querySelector("main")!.append();
