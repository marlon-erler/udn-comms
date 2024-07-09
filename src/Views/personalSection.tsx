import * as React from "bloatless-react";

import { senderName } from "../Model/model";
import { translation } from "../translations";

export function PersonalSection() {
  return (
    <div class="flex-column">
      <h2>{translation.personal}</h2>

      <label class="tile">
        <span class="icon">account_circle</span>
        <div>
          <span>{translation.yourName}</span>
          <input
            bind:value={senderName}
            placeholder={translation.namePlaceholder}
          ></input>
        </div>
      </label>
    </div>
  );
}
