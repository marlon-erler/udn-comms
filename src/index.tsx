import "./styles.css";

import * as React from "bloatless-react";

import { MessageTab } from "./Tabs/messageTab";
import { SettingsTab } from "./Tabs/settingsTab";
import { translation } from "./translations";

document.body.prepend(
  <menu class="mobile-only">
    <a class="tab-link" href="#settings-tab" active>
        <span class="icon">settings</span>
        {translation.settings}
    </a>
    <a class="tab-link" href="#message-tab">
        <span class="icon">forum</span>
        {translation.messages}
    </a>
  </menu>
);
document.querySelector("main")!.append(SettingsTab(), MessageTab());
document.querySelector("main")!.classList.add("split");
