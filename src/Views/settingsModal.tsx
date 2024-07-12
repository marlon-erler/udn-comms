import * as React from "bloatless-react";

import {
  clearCategories,
  clearStatuses,
  isPresentingSettingsModal,
  repairApp,
  toggleSettings,
  zoomIn,
  zoomOut,
} from "../Model/model";

import { icons } from "../icons";
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

          <div class="flex-column width-input">
            <button class="width-100 flex-1" on:click={repairApp}>
              {translation.repairApp}
              <span class="icon">handyman</span>
            </button>
          </div>

          <hr></hr>

          <div class="flex-column width-input gap">
            <button class="width-100 flex-1" on:click={clearCategories}>
              {translation.clearCategories}
              <span class="icon">{icons.categoryName}</span>
            </button>
            <button class="width-100 flex-1" on:click={clearStatuses}>
              {translation.clearStatuses}
              <span class="icon">{icons.status}</span>
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
