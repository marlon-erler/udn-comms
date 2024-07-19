import * as React from "bloatless-react";

import { translations } from "./translations";

export function SetttingsModal() {
  return (
    <div class="modal">
      <div>
        <main>
          <h2>{translations.settings.settingsHeadline}</h2>
        </main>
        <button>
          {translations.general.closeButton}
          <span class="icon">close</span>
        </button>
      </div>
    </div>
  );
}
