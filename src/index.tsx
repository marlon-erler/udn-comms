import "./styles.css";

import { MessageTab } from "./Tabs/messageTab";
import { OverviewTab } from "./Tabs/overviewTab";
import { SettingsModal } from "./Views/settingsModal";

document
  .querySelector("main")!
  .append(OverviewTab(), MessageTab(), SettingsModal());
document.querySelector("main")!.classList.add("split");