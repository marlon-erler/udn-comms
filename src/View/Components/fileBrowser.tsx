import "./fileBrowser.css";

import * as React from "bloatless-react";

import StorageModel, {
  PATH_COMPONENT_SEPARATOR,
} from "../../Model/storageModel";

import { DangerousActionButton } from "./dangerousActionButton";
import { DirectoryItemList } from "./directoryItemList";
import StorageViewModel from "../../ViewModel/storageViewModel";
import { translations } from "../translations";

export function FileBrowser(storageViewModel: StorageViewModel) {
  const detailView = React.createProxyState(
    [storageViewModel.selectedPath],
    () => {
      if (storageViewModel.selectedPath.value == PATH_COMPONENT_SEPARATOR)
        return (
          <span class="secondary">{translations.storage.noItemSelected}</span>
        );

      return (
        <div class="flex-column gap">
          <div class="tile flex-no">
            <div>
              <b>{translations.storage.path}</b>
              <span
                class="break-all"
                subscribe:innerText={storageViewModel.selectedPath}
              ></span>
            </div>
          </div>
          <div class="tile flex-no">
            <div>
              <b>{translations.storage.content}</b>
              <code
                subscribe:innerText={storageViewModel.selectedFileContent}
              ></code>
            </div>
          </div>

          {DangerousActionButton(
            translations.storage.deleteItem,
            "delete_forever",
            storageViewModel.deleteSelectedItem
          )}
        </div>
      );
    }
  );

  const view = (
    <div class="file-browser">
      <div>
        <div class="scroll-area">{DirectoryItemList(storageViewModel)}</div>
        <div class="detail-button-wrapper">
          <button class="ghost" on:click={scrollToDetails}>
            <span
              class="ellipsis"
              subscribe:innerText={storageViewModel.selectedFileName}
            ></span>
            <span class="icon">arrow_forward</span>
          </button>
        </div>
      </div>
      <div class="scroll-area" children:set={detailView}></div>
    </div>
  );

  function scrollToDetails() {
    view.scrollLeft = view.scrollWidth;
  }

  return view;
}
