import * as React from "bloatless-react";

import ConnectionViewModel from "../../ViewModel/connectionViewModel";
import { DeletableListItem } from "../Components/deletableListItem";
import { translations } from "../translations";

export function ConnectionModal(connectionViewModel: ConnectionViewModel) {
  const previousAddressConverter: React.StateItemConverter<string> = (
    address: string
  ) => {
    return DeletableListItem(address, () => {
      connectionViewModel.removePreviousAddress(address);
    });
  };

  return (
    <div
      class="modal"
      toggle:open={connectionViewModel.isShowingConnectionModal}
    >
      <div>
        <main>
          <h2>{translations.connectionModal.connectionModalHeadline}</h2>

          <div
            class="flex-column gap"
            children:append={[
              connectionViewModel.previousAddresses,
              previousAddressConverter,
            ]}
          ></div>
        </main>
        <button on:click={connectionViewModel.hideConnectionModal}>
          {translations.general.closeButtonAudioLabel}
          <span class="icon">close</span>
        </button>
      </div>
    </div>
  );
}
