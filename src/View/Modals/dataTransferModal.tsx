import * as React from "bloatless-react";

import FileTransferViewModel, {
  FileTransferModal,
  FileTransferOption,
} from "../../ViewModel/Global/fileTransferViewModel";

import StorageModel from "../../Model/Global/storageModel";
import { translations } from "../translations";

export function DataTransferModalWrapper(
  fileTransferViewModel: FileTransferViewModel
) {
  return (
    <div>
      {DirectionSelectionModal(fileTransferViewModel)}
      {FileSelectionModal(fileTransferViewModel)}
    </div>
  );
}

function DirectionSelectionModal(fileTransferViewModel: FileTransferViewModel) {
  const isPresented = React.createProxyState(
    [fileTransferViewModel.presentedModal],
    () =>
      fileTransferViewModel.presentedModal.value ==
      FileTransferModal.DirectionSelection
  );

  return (
    <div class="modal" toggle:open={isPresented}>
      <div>
        <main>
          <h2>{translations.dataTransferModal.transferDataHeadline}</h2>

          <div class="flex-column gap content-margin-bottom">
            <button
              class="tile"
              on:click={fileTransferViewModel.showFileSelectionModal}
            >
              <span class="icon">upload</span>
              <div>
                <b>{translations.dataTransferModal.fromThisDeviceButton}</b>
              </div>
              <span class="icon">arrow_forward</span>
            </button>
            <button class="tile">
              <span class="icon">download</span>
              <div>
                <b>{translations.dataTransferModal.toThisDeviceButton}</b>
              </div>
              <span class="icon">arrow_forward</span>
            </button>
          </div>
        </main>
        <button on:click={fileTransferViewModel.hideModal}>
          {translations.general.closeButton}
          <span class="icon">close</span>
        </button>
      </div>
    </div>
  );
}

function FileSelectionModal(fileTransferViewModel: FileTransferViewModel) {
  // option
  const OptionConverter: React.StateItemConverter<FileTransferOption> = (
    fileOption: FileTransferOption
  ) => {
    return OptionEntry(fileOption, fileTransferViewModel);
  };

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

  // state
  const isPresented = React.createProxyState(
    [fileTransferViewModel.presentedModal],
    () =>
      fileTransferViewModel.presentedModal.value ==
      FileTransferModal.FileSelection
  );

  return (
    <div class="modal" toggle:open={isPresented}>
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
            on:click={fileTransferViewModel.showDirectionSelectionModal}
          >
            {translations.general.backButton}
          </button>
          <button
            class="primary flex"
            on:click={fileTransferViewModel.hideModal}
            toggle:disabled={fileTransferViewModel.hasNoPathsSelected}
          >
            {translations.general.continueButton}
            <span class="icon">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
