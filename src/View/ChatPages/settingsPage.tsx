import * as React from "bloatless-react";

import ChatViewModel from "../../ViewModel/chatViewModel";
import { translations } from "../translations";

export function SettingsPage(chatViewModel: ChatViewModel) {
  return (
    <div>
      <div class="toolbar">
        <span>{translations.chatPage.settings.settingsHeadline}</span>
      </div>
    </div>
  );
}
