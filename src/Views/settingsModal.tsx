import * as React from "bloatless-react";

import {
  isPresentingSettingsModal,
  repairApp,
  toggleSettings,
  zoomIn,
  zoomOut,
} from "../Model/model";

import { translation } from "../translations";

export function SettingsModal() {
  return (
    <div class="modal" toggle:open={isPresentingSettingsModal}>
      <div>
        <main>
          <h2>{translation.settings}</h2>

          <div class="flex-row width-input gap">
            <button class="width-100 flex justify-start" on:click={zoomOut}>
              <span class="icon">zoom_out</span>
              {translation.zoomOut}
            </button>
            <button class="width-100 flex justify-start" on:click={zoomIn}>
              <span class="icon">zoom_in</span>
              {translation.zoomIn}
            </button>
          </div>

          <hr></hr>

          <div class="flex-row width-input">
            <button class="width-100 flex-1" on:click={repairApp}>
              {translation.repairApp}
              <span class="icon">handyman</span>
            </button>
          </div>
        </main>
        <button class="width-100" on:click={toggleSettings}>
          {translation.close}
          <span class="icon">close</span>
        </button>
      </div>
    </div>
  );
}
