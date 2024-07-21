import * as React from "bloatless-react";

import StorageModel from "../../Model/storageModel";
import { translations } from "../translations";

export function DirectoryItemList(
  storageModel: StorageModel,
  pathString: string,
  selectedPath: React.State<string>
) {
  // converter
  const StringToDirectoryItemList: React.StateItemConverter<string> = (
    pathString: string
  ) => DirectoryItemList(storageModel, pathString, selectedPath);

  // data
  const path = StorageModel.stringToPathComponents(pathString);
  const fileName = StorageModel.getFileName(path);
  const items = new React.ListState<string>();

  const style = `text-indent: ${path.length * 2}rem`;

  // methods
  function loadItems() {
    items.clear();

    const directoryItems = storageModel.list(path);

    for (const directoryItem of directoryItems) {
      const itemPath = [...path, directoryItem];
      const pathString = StorageModel.pathComponentsToString(...itemPath);
      items.add(pathString);
    }
  }

  function select() {
    selectedPath.value = pathString;
  }

  // state
  const isSelected = React.createProxyState(
    [selectedPath],
    () => selectedPath.value == pathString
  );

  isSelected.subscribe(() => {
    if (isSelected.value == false) return;
    loadItems();
  });

  return (
    <div class="flex-column">
      <button
        class="width-100 flex-1 clip"
        toggle:selected={isSelected}
        on:click={select}
      >
        <span class="ellipsis width-100 flex-1" style={style}>
          {fileName}
        </span>
      </button>

      <div
        class="flex-column"
        children:append={[items, StringToDirectoryItemList]}
      ></div>
    </div>
  );
}
