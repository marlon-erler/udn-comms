import * as React from "bloatless-react";

import BoardViewModel from "../../ViewModel/Pages/boardViewModel";

export function BoardEntry(boardViewModel: BoardViewModel) {
  const view = (
    <button
      set:color={boardViewModel.color}
      class="tile colored-tile"
    >
      <span class="shadow" subscribe:innerText={boardViewModel.name}></span>
      <b subscribe:innerText={boardViewModel.name}></b>
    </button>
  );

  return view;
}

export const BoardInfoToEntry: React.StateItemConverter<
  BoardViewModel
> = (boardViewModel: BoardViewModel) => {
  return BoardEntry(boardViewModel);
};
