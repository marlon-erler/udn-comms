import * as React from "bloatless-react";

import FileTransferViewModel, {
  FileTransferOption,
} from "../../ViewModel/Global/fileTransferViewModel";

import StorageModel from "../../Model/Global/storageModel";
import { translations } from "../translations";

export function FileTransferModal(
  fileTransferViewModel: FileTransferViewModel
) {
  return (
    <div
      class="modal"
      toggle:open={fileTransferViewModel.isShowingTransferModal}
    >
      <div>
        <main>
          <h2>{translations.fileTransferModal.transferFilesHeadline}</h2>
          <span class="secondary">
            {translations.fileTransferModal.selectionDescription}
          </span>

          <hr></hr>

          <h3>{translations.fileTransferModal.generalHeadline}</h3>
          <div
            class="flex-column gap content-margin-bottom"
            children:append={[
              fileTransferViewModel.generalFileOptions,
              FileOption,
            ]}
          ></div>

          <h3>{translations.fileTransferModal.chatsHeadline}</h3>
          <div
            class="flex-column gap"
            children:append={[
              fileTransferViewModel.chatFileOptions,
              FileOption,
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

function FileOption(fileOption: FileTransferOption) {
  return (
    <button class="tile">
      <div>
        <b class="ellipsis">{fileOption.label}</b>
        <span class="secondary ellipsis">
          {StorageModel.pathComponentsToString(...fileOption.path)}
        </span>
      </div>
    </button>
  );
}
