console.log("Hello!")

import { MessageTab } from "./Tabs/messageTab";
import { OverviewTab } from "./Tabs/overviewTab";

document.querySelector("main")!.append(OverviewTab(), MessageTab());
document.querySelector("main")!.classList.add("split");
