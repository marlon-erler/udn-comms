import * as React from "bloatless-react";

import SearchViewModel from "../../ViewModel/Utility/searchViewModel";
import { translations } from "../translations";

export function SearchModal<T>(
  headline: string,
  allObjects: React.ListState<T> | React.MapState<T>,
  filteredObjects: React.ListState<T>,
  converter: React.StateItemConverter<T>,
  getStringsOfObject: (object: T) => string[],
  isOpen: React.State<boolean>
) {
  const viewModel: SearchViewModel<T> = new SearchViewModel(
    allObjects,
    filteredObjects,
    getStringsOfObject
  );

  function close() {
    isOpen.value = false;
  }

  return (
    <div class="modal" toggle:open={isOpen}>
      <div style="max-width: 64rem">
        <main>
          <h2>{headline}</h2>
          <div class="flex-row width-input">
            <input
              placeholder={translations.general.searchLabel}
              bind:value={viewModel.searchInput}
              on:enter={viewModel.applySearch}
            ></input>
            <button
              class="primary"
              aria-label={translations.general.searchButtonAudioLabel}
              on:click={viewModel.applySearch}
              toggle:disabled={viewModel.cannotApplySearch}
            >
              <span class="icon">search</span>
            </button>
          </div>

          <hr></hr>

          <div
            class="grid gap"
            children:append={[filteredObjects, converter]}
          ></div>
        </main>
        <button on:click={close}>
          {translations.general.closeButton}
          <span class="icon">close</span>
        </button>
      </div>
    </div>
  );
}
