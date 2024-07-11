import * as React from "bloatless-react";

import { translation } from "../../translations";

export function PlaceholderView() {
  return <div class="flex-column width-100 height-100 align-center justify-center secondary">
    {translation.noObjects}
  </div>;
}
