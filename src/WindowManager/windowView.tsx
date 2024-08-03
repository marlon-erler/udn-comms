import * as React from "bloatless-react";

import WindowManager, { Window } from "./windowManager";

export function showWindow(
  title: React.State<string>,
  windowManager: WindowManager
) {
  const window: Window = new Window(windowManager, (window: Window) => {
    // handles
    const dragger = <div class="dragger" subscribe:innerText={title}></div>;

    const leftHandle = <div class="left-resize-handle"></div>;
    const rightHandle = <div class="right-resize-handle"></div>;
    const topHandle = <div class="top-resize-handle"></div>;
    const bottomHandle = <div class="bottom-resize-handle"></div>;

    const topLeftHandle = <div class="top-left-resize-handle"></div>;
    const topRightHandle = <div class="top-right-resize-handle"></div>;
    const bottomLeftHandle = <div class="bottom-left-resize-handle"></div>;
    const bottomRightHandle = <div class="bottom-right-resize-handle"></div>;

    window.registerHandle(dragger, { drag: true });

    window.registerHandle(leftHandle, { resizeLeft: true });
    window.registerHandle(rightHandle, { resizeRight: true });
    window.registerHandle(topHandle, { resizeTop: true });
    window.registerHandle(bottomHandle, { resizeBottom: true });

    window.registerHandle(topLeftHandle, { resizeTop: true, resizeLeft: true });
    window.registerHandle(topRightHandle, {
      resizeTop: true,
      resizeRight: true,
    });
    window.registerHandle(bottomLeftHandle, {
      resizeBottom: true,
      resizeLeft: true,
    });
    window.registerHandle(bottomRightHandle, {
      resizeBottom: true,
      resizeRight: true,
    });

    const titlebar = (
      <div class="titlebar">
        {dragger}
        <div class="button-row">
          <button
            class="more-options-button standard"
            on:click={window.maximize}
          >
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

    return (
      <div>
        <div class="background"></div>
        {titlebar}
        <div class="content-wrapper">
          <div class="content">
            <input bind:value={title}></input>
          </div>
        </div>

        {leftHandle}
        {rightHandle}
        {topHandle}
        {bottomHandle}

        {topLeftHandle}
        {topRightHandle}
        {bottomLeftHandle}
        {bottomRightHandle}
      </div>
    );
  });

  window.show();
}
