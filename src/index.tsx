import { MessageTab } from "./Tabs/messageTab";
import { SettingsTab } from "./Tabs/settingsTab";

document.querySelector("main")!.append(SettingsTab(), MessageTab());
document.querySelector("main")!.classList.add("split");
