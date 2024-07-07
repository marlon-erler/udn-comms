import * as React from "bloatless-react";

import { MessageComposer } from "../Views/messageComposer";
import { ThreadView } from "../Views/threadView";
import { translation } from "../translations";

export function MessageTab() {
  return (
    <article id="message-tab">
      <header>{translation.messages}</header>
      {ThreadView()}
      <footer>{MessageComposer()}</footer>
    </article>
  );
}
