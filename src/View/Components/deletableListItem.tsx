import * as React from "bloatless-react";

import { translations } from "../translations";

export function DeletableListItem(text: string, ondelete: () => void) {
  return (
    <div class="tile flex-row justify-apart align-center padding-0">
      <span class="padding-h">{text}</span>

      <button
        class="danger"
        aria-label={translations.general.deleteItemButtonAudioLabel}
        on:click={ondelete}
      >
        <span class="icon">delete</span>
      </button>
    </div>
  );
}