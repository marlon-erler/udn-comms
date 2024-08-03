import * as React from "bloatless-react";

import WindowManager, { Window } from "./windowManager";

export function showWindow(
  title: React.State<string>,
  windowManager: WindowManager
) {
  const window: Window = new Window((window: Window) => {
    const dragger = <div class="dragger" subscribe:innerText={title}></div>;
    const titlebar = (
      <div class="titlebar">
        {dragger}
        <div class="button-row">
        <button class="more-options-button standard" on:click={window.maximize}>
            <span class="icon">more_horiz</span>
          </button>
          <button class="maximize-button standard" on:click={window.maximize}>
            <span class="icon">expand_content</span>
          </button>
          <button
            class="unmaximize-button standard"
            on:click={window.unmaximize}
          >
            <span class="icon">collapse_content</span>
          </button>
          <button class="close-button danger" on:click={window.close}>
            <span class="icon">close</span>
          </button>
        </div>
      </div>
    );
    window.registerDragger(dragger);

    return (
      <div>
        <div class="background"></div>
        {titlebar}
        <div class="content-wrapper">
          <main>
            <input bind:value={title}></input>
          </main>
        </div>
      </div>
    );
  });

  window.show(windowManager);
}
