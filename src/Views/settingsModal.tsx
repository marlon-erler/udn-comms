import * as React from "bloatless-react";

import {
  clearAddresses,
  clearCategories,
  clearObjectSearches,
  clearStatuses,
  firstDayOfWeek,
  isPresentingSettingsModal,
  repairApp,
  toggleSettings,
  zoomIn,
  zoomOut,
} from "../Model/model";

import { icons } from "../icons";
import { translation } from "../translations";

export function SettingsModal() {
  const stringToWeekdayOption: React.StateItemConverter<number> = (value) => {
    const isSelected = value == firstDayOfWeek.value;
    return <option toggle:selected={isSelected} value={value}>{translation.weekdays[value]}</option>;
  };

  return (
    <div class="modal" toggle:open={isPresentingSettingsModal}>
      <div>
        <main>
          <h2>{translation.settings}</h2>

          <label class="tile">
            <span class="icon">calendar_month</span>
            <div>
              <span>{translation.firstDayOfWeek}</span>
              <select bind:value={firstDayOfWeek}>
                {...translation.weekdays.map((weekday, i) =>
                  stringToWeekdayOption(i)
                )}
              </select>
              <span class="icon">arrow_drop_down</span>
            </div>
          </label>

          <hr></hr>

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
            <button class="tile width-100 flex-1" on:click={repairApp}>
              <span class="icon">handyman</span>
              {translation.repairApp}
            </button>
          </div>

          <hr></hr>

          <div class="flex-column width-input gap">
            <button class="tile width-100 flex-1" on:click={clearAddresses}>
              <span class="icon">cell_tower</span>
              {translation.clearAddresses}
            </button>
            <button class="tile width-100 flex-1" on:click={clearCategories}>
              <span class="icon">{icons.categoryName}</span>
              {translation.clearCategories}
            </button>
            <button class="tile width-100 flex-1" on:click={clearStatuses}>
              <span class="icon">{icons.status}</span>
              {translation.clearStatuses}
            </button>
            <button
              class="tile width-100 flex-1"
              on:click={clearObjectSearches}
            >
              <span class="icon">search</span>
              {translation.clearObjectFilters}
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
