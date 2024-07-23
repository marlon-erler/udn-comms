import * as React from "bloatless-react";

import BoardViewModel from "../../ViewModel/Pages/boardViewModel";

export function BoardPage(boardViewModel: BoardViewModel) {
  return <div class="pane">
    <div class="toolbar"></div>
    <div class="content"></div>
  </div>;
}
