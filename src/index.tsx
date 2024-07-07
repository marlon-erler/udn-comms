import "./styles.css";

import * as React from "bloatless-react";

import { MessageTab } from "./Tabs/messageTab";
import { SettingsTab } from "./Tabs/settingsTab";
import { translation } from "./translations";

document.querySelector("main")!.append(SettingsTab(), MessageTab());
document.querySelector("main")!.classList.add("split");
