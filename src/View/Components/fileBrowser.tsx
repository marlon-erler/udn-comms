import "./fileBrowser.css";

import * as React from "bloatless-react";

import StorageModel, {
  PATH_COMPONENT_SEPARATOR,
} from "../../Model/storageModel";

import { DirectoryItemList } from "./directoryItemList";

export function FileBrowser(
  storageModel: StorageModel,
  selectedPath: React.State<string>
) {
  // state
  const fileContent = React.createProxyState([selectedPath], () => {
    const path = StorageModel.stringToPathComponents(selectedPath.value);
    const content = storageModel.restore(path);
    return content || "";
  });

  const selectedFileName = React.createProxyState(
    [selectedPath],
    () =>
      StorageModel.getFileNameFromString(selectedPath.value) ??
      PATH_COMPONENT_SEPARATOR
  );

  // view
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
      <div class="scroll-area">
        <code subscribe:innerText={fileContent}></code>
      </div>
    </div>
  );

  function scrollToDetails() {
    view.scrollLeft = view.scrollWidth;
  }

  return view;
}
