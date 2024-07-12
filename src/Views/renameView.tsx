import * as React from "bloatless-react";

import { translation } from "../translations";

export function RenameView(
  editingName: React.State<string>,
  initialName: string,
  rename: () => void
) {
  const cannotRename = React.createProxyState(
    [editingName],
    () => editingName.value == initialName || editingName.value == ""
  );

  return (
    <div class="flex-row align-center justify-apart object-entry-wide">
      <input bind:value={editingName} on:enter={rename}></input>
      <button
        class="primary"
        aria-label={translation.rename}
        on:click={rename}
        toggle:disabled={cannotRename}
      >
        <span class="icon">edit</span>
      </button>
    </div>
  );
}
