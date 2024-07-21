import "./fileBrowser.css";

import * as React from "bloatless-react";

import { DirectoryItemList } from "./directoryItemList";
import StorageModel from "../../Model/storageModel";

export function FileBrowser(
  storageModel: StorageModel,
  selectedPath: React.State<string>
) {
  const fileContent = React.createProxyState([selectedPath], () => {
    const path = StorageModel.stringToPathComponents(selectedPath.value);
    const content = storageModel.restore(path);
    return content || "";
  });

  return (
    <div class="file-browser">
      {DirectoryItemList(storageModel, "\\", selectedPath)}
      <div>
        <code subscribe:innerText={fileContent}></code>
      </div>
    </div>
  );
}
