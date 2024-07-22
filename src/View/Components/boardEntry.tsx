import * as React from "bloatless-react";

import { BoardInfoFileContent } from "../../Model/Files/taskModel";

export function BoardEntry(boardInfo: BoardInfoFileContent) {
  const view = (
    <button
      color={boardInfo.color}
      class="tile colored-tile"
    >
      <span class="shadow">{boardInfo.name}</span>
      <b>{boardInfo.name}</b>
    </button>
  );

  return view;
}

export const BoardInfoToEntry: React.StateItemConverter<
  BoardInfoFileContent
> = (boardInfo: BoardInfoFileContent) => {
  return BoardEntry(boardInfo);
};
