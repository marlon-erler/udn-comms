import * as React from "bloatless-react";

import ConnectionViewModel from "../../ViewModel/connectionViewModel";
import { translations } from "../translations";

export function ConnectionModal(connectionViewModel: ConnectionViewModel) {
  return (
    <div
      class="modal"
      toggle:open={connectionViewModel.isShowingConnectionModal}
    >
      <div>
        <main></main>
        <button on:click={connectionViewModel.hideConnectionModal}>
          {translations.general.closeButton}
          <span class="icon">close</span>
        </button>
      </div>
    </div>
  );
}
