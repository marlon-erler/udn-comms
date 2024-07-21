import "./fileBrowser.css";

import * as React from "bloatless-react";

import StorageModel, {
  PATH_COMPONENT_SEPARATOR,
} from "../../Model/storageModel";

import { DirectoryItemList } from "./directoryItemList";
import { translations } from "../translations";

export function FileBrowser(
  storageModel: StorageModel,
  selectedPath: React.State<string>,
  didMakeChanges: React.State<boolean>
) {
  // state
  const fileContentToShow = React.createProxyState([selectedPath], () => {
    const path = StorageModel.stringToPathComponents(selectedPath.value);
    const content = storageModel.restore(path);
    return (
      (content ?? translations.fileBrowser.notAFile) ||
      translations.fileBrowser.contentEmpty
    );
  });

  const selectedFileName = React.createProxyState(
    [selectedPath],
    () =>
      StorageModel.getFileNameFromString(selectedPath.value) ??
      PATH_COMPONENT_SEPARATOR
  );

  // view
  const detailView = React.createProxyState([selectedPath], () => {
    if (selectedPath.value == PATH_COMPONENT_SEPARATOR)
      return (
        <span class="secondary">{translations.fileBrowser.noItemSelected}</span>
      );

    return (
      <div class="flex-column gap">
        <div class="tile flex-no">
          <div>
            <b>{translations.fileBrowser.path}</b>
            <span class="break-all" subscribe:innerText={selectedPath}></span>
          </div>
        </div>
        <div class="tile flex-no">
          <div>
            <b>{translations.fileBrowser.content}</b>
            <code subscribe:innerText={fileContentToShow}></code>
          </div>
        </div>
      </div>
    );
  });

  const view = (
    <div class="file-browser">
      <div>
        <div class="scroll-area">
          {DirectoryItemList(
            storageModel,
            PATH_COMPONENT_SEPARATOR,
            selectedPath
          )}
        </div>
        <div class="detail-button-wrapper">
          <button class="ghost" on:click={scrollToDetails}>
            <span
              class="ellipsis"
              subscribe:innerText={selectedFileName}
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
