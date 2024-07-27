import * as React from "bloatless-react";

import FileTransferViewModel, {
  FileTransferOption,
} from "../../ViewModel/Global/fileTransferViewModel";

import StorageModel from "../../Model/Global/storageModel";
import { translations } from "../translations";

export function DataTransferModal(
  fileTransferViewModel: FileTransferViewModel
) {
  const OptionConverter: React.StateItemConverter<FileTransferOption> = (
    fileOption: FileTransferOption
  ) => {
    return OptionEntry(fileOption, fileTransferViewModel);
  };

  return (
    <div
      class="modal"
      toggle:open={fileTransferViewModel.isShowingTransferModal}
    >
      <div>
        <main>
          <h2>{translations.dataTransferModal.transferDataHeadline}</h2>
          <span class="secondary">
            {translations.dataTransferModal.selectionDescription}
          </span>

          <hr></hr>

          <h3>{translations.dataTransferModal.generalHeadline}</h3>
          <div
            class="flex-column gap content-margin-bottom"
            children:append={[
              fileTransferViewModel.generalFileOptions,
              OptionConverter,
            ]}
          ></div>

          <h3>{translations.dataTransferModal.chatsHeadline}</h3>
          <div
            class="flex-column gap"
            children:append={[
              fileTransferViewModel.chatFileOptions,
              OptionConverter,
            ]}
          ></div>
        </main>
        <div class="flex-row width-100">
          <button
            class="flex"
            on:click={fileTransferViewModel.hideTransferModal}
          >
            {translations.general.cancelButton}
          </button>
          <button
            class="primary flex"
            on:click={fileTransferViewModel.hideTransferModal}
          >
            {translations.general.continueButton}
            <span class="icon">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionEntry(
  fileOption: FileTransferOption,
  fileTransferViewModel: FileTransferViewModel
) {
  const isSelected = new React.State(false);
  isSelected.subscribeSilent((isSelected) => {
    if (isSelected == true) {
      fileTransferViewModel.selectedPaths.add(fileOption.path);
    } else {
      fileTransferViewModel.selectedPaths.remove(fileOption.path);
    }
  });
  function toggle() {
    isSelected.value = !isSelected.value;
  }

  return (
    <button class="tile" toggle:selected={isSelected} on:click={toggle}>
      <div>
        <b class="ellipsis">{fileOption.label}</b>
        <span class="secondary ellipsis">
          {StorageModel.pathComponentsToString(...fileOption.path)}
        </span>
      </div>
    </button>
  );
}
