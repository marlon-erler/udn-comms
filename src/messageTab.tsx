import * as React from "bloatless-react";

import { getText } from "./translations";

export function MessageTab() {
  return (
    <article id="message-tab">
      <header>{getText("messages")}</header>
    </article>
  );
}
