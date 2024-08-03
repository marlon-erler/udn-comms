import "./windowManager.css";

export default class WindowManager {
  root: HTMLElement;
  windows: Set<Window> = new Set();
  focusedWindow: Window | undefined = undefined;
  highestZIndex: number = 0;

  // dragging & resizing
  draggedOrResizedWindow: Window | undefined = undefined;

  lastClickLocation: [number, number] | undefined = undefined;

  // dimentions
  get leftEdge(): number {
    return this.root.offsetLeft;
  }

  get upperEdge(): number {
    return this.root.offsetTop;
  }

  // methods
  showWindow = (window: Window): void => {
    this.focusWindow(window);

    this.windows.add(window);
    this.root.append(window.view);
  };

  closeWindow = (window: Window): void => {
    window.view.toggleAttribute("closing", true);
    window.view.addEventListener("transitionend", () => {
      window.view.remove();
    });

    this.windows.delete(window);

    if (this.focusedWindow == window) {
      this.focusedWindow = undefined;
    }
  };

  focusWindow = (window: Window): void => {
    if (window == this.focusedWindow) return;
    const previouslyFocusedWindow: Window | undefined = this.focusedWindow;

    if (previouslyFocusedWindow != undefined) {
      window.zIndex = previouslyFocusedWindow.zIndex + 1;
    } else {
      window.zIndex = this.highestZIndex + 1;
    }

    this.focusedWindow = window;
    this.highestZIndex = window.zIndex;

    window.updateFocus();
    previouslyFocusedWindow?.updateFocus();
  };

  // pointer
  captureClickLocation = (e: MouseEvent | TouchEvent): void => {
    this.lastClickLocation = this.getRelativeCursorPosition(e);
  };

  handlePointerMove = (e: MouseEvent | TouchEvent): void => {
    if (this.draggedOrResizedWindow == undefined) return;
    if (this.lastClickLocation == undefined) return;

    const [cursorFromLeftCanvasEdge, cursorFromUpperCanvasEdge]: [
      number,
      number
    ] = this.getRelativeCursorPosition(e);
    const [lastClickX, lastClickY] = this.lastClickLocation;
    const xDifference: number = lastClickX - cursorFromLeftCanvasEdge;
    const yDifference: number = lastClickY - cursorFromUpperCanvasEdge;

    // move
    if (this.draggedOrResizedWindow.movingOffset != undefined) {
      const [offsetX, offsetY] = this.draggedOrResizedWindow.movingOffset;

      const newX = cursorFromLeftCanvasEdge - offsetX;
      const newY = cursorFromUpperCanvasEdge - offsetY;
      this.draggedOrResizedWindow.setPosition(newX, newY);
    }
    // resize width
    if (this.draggedOrResizedWindow.initialWidth != undefined) {
      if (this.draggedOrResizedWindow.initialLeft != undefined) {
        // left edge
        const newLeft: number =
          this.draggedOrResizedWindow.initialLeft - xDifference;
        this.draggedOrResizedWindow.setLeft(newLeft);

        const newWidth: number =
          this.draggedOrResizedWindow.initialWidth + xDifference;
        this.draggedOrResizedWindow.setWidth(newWidth);
      } else {
        // right edge
        const newWidth: number =
          this.draggedOrResizedWindow.initialWidth - xDifference;
        this.draggedOrResizedWindow.setWidth(newWidth);
      }
    }
    // resize height
    if (this.draggedOrResizedWindow.initialHeight != undefined) {
      if (this.draggedOrResizedWindow.initialTop != undefined) {
        // top edge
        const newTop: number =
          this.draggedOrResizedWindow.initialTop - yDifference;
        this.draggedOrResizedWindow.setTop(newTop);

        const newHeight: number =
          this.draggedOrResizedWindow.initialHeight + yDifference;
        this.draggedOrResizedWindow.setHeight(newHeight);
      } else {
        // bottom edge
        const newHeight: number =
          this.draggedOrResizedWindow.initialHeight - yDifference;
        this.draggedOrResizedWindow.setHeight(newHeight);
      }
    }
  };

  stopPointerAction = (): void => {
    this.draggedOrResizedWindow?.resetAction();
    this.draggedOrResizedWindow = undefined;
  };

  // utility
  getRelativeCursorPosition = (
    e: MouseEvent | TouchEvent
  ): [number, number] => {
    const cursorFromLeftScreenEdge: number = getCursorPosition(e, "clientX");
    const cursorFromLeftCanvasEdge: number =
      cursorFromLeftScreenEdge - this.leftEdge;

    const cursorFromUpperScreenEdge: number = getCursorPosition(e, "clientY");
    const cursorFromUpperCanvasEdge: number =
      cursorFromUpperScreenEdge - this.upperEdge;

    return [cursorFromLeftCanvasEdge, cursorFromUpperCanvasEdge];
  };

  // init
  constructor(root: HTMLElement) {
    this.root = root;
    root.classList.add("window-manager");

    root.addEventListener("mousedown", (e) => this.captureClickLocation(e));
    root.addEventListener("touchstart", (e) => this.captureClickLocation(e));

    root.addEventListener("mousemove", (e) => this.handlePointerMove(e));
    root.addEventListener("touchmove", (e) => this.handlePointerMove(e));

    root.addEventListener("mouseup", () => this.stopPointerAction());
    root.addEventListener("touchend", () => this.stopPointerAction());
  }
}

export class Window {
  view: HTMLElement;
  windowManager: WindowManager;

  // action
  movingOffset: [number, number] | undefined = undefined;

  initialLeft: number | undefined = undefined;
  initialTop: number | undefined = undefined;

  initialWidth: number | undefined = undefined;
  initialHeight: number | undefined = undefined;

  // position etc
  positionX: number = 50;
  positionY: number = 50;

  height: number = 200;
  width: number = 300;

  // focus
  get isFocused(): boolean {
    if (this.windowManager == undefined) return false;
    return this.windowManager.focusedWindow == this;
  }

  private _zIndex: number = 1;
  get zIndex(): number {
    return this._zIndex;
  }
  set zIndex(newValue: number) {
    this._zIndex = newValue;
    this.view.style.zIndex = newValue.toString();
  }

  // methods
  show = (): void => {
    this.windowManager.showWindow(this);

    this.updatePosition();
    this.updateSize();
  };

  close = (): void => {
    if (this.windowManager == undefined) return;
    this.windowManager.closeWindow(this);
  };

  focus = (): void => {
    if (this.windowManager == undefined) return;
    this.windowManager.focusWindow(this);
  };

  // dimentions
  setPosition = (x: number, y: number): void => {
    this.setLeft(x);
    this.setTop(y);
  };

  setLeft = (left: number): void => {
    this.positionX = left;
    this.updatePosition();
  };

  setTop = (top: number): void => {
    this.positionY = top;
    this.updatePosition();
  };

  setWidth = (width: number): void => {
    this.width = width;
    this.updateSize();
  };

  setHeight = (height: number): void => {
    this.height = height;
    this.updateSize();
  };

  maximize = (): void => {
    this.view.toggleAttribute("maximized", true);
  };

  unmaximize = (): void => {
    this.view.toggleAttribute("maximized", false);
  };

  // update
  updatePosition = (): void => {
    this.view.style.left = toPx(this.positionX);
    this.view.style.top = toPx(this.positionY);
  };

  updateSize = (): void => {
    this.view.style.width = toPx(this.width);
    this.view.style.height = toPx(this.height);
  };

  updateFocus = (): void => {
    this.view.toggleAttribute("focused", this.isFocused);
  };

  // actions
  resetAction = (): void => {
    this.movingOffset = undefined;
    this.initialLeft = undefined;
    this.initialTop = undefined;
    this.initialWidth = undefined;
    this.initialHeight = undefined;
  };

  registerHandle = (dragger: HTMLElement, action: WindowAction): void => {
    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      this.windowManager.draggedOrResizedWindow = this;

      if (action.drag == true) {
        this.movingOffset = this.getWindowOffset(e);
      }
      if (action.resizeLeft == true) {
        this.initialLeft = this.view.offsetLeft;
        this.initialWidth = this.view.offsetWidth;
      }
      if (action.resizeRight == true) {
        this.initialWidth = this.view.offsetWidth;
      }
      if (action.resizeTop == true) {
        this.initialTop = this.view.offsetTop;
        this.initialHeight = this.view.offsetHeight;
      }
      if (action.resizeBottom == true) {
        this.initialHeight = this.view.offsetHeight;
      }
    };

    // start
    dragger.addEventListener("mousedown", handleDragStart);
    dragger.addEventListener("touchstart", handleDragStart);
  };

  getWindowOffset = (e: MouseEvent | TouchEvent): [number, number] => {
    const [cursorFromLeftCanvasEdge, cursorFromUpperCanvasEdge] =
      this.windowManager.getRelativeCursorPosition(e);

    const leftWindowEdge: number = this.view.offsetLeft;
    const leftOffset: number = cursorFromLeftCanvasEdge - leftWindowEdge;

    const upperWindowEdge: number = this.view.offsetTop;
    const topOffset: number = cursorFromUpperCanvasEdge - upperWindowEdge;

    return [leftOffset, topOffset];
  };

  // init
  constructor(
    windowManager: WindowManager,
    viewBuilder: (window: Window) => HTMLElement
  ) {
    this.windowManager = windowManager;

    this.view = viewBuilder(this);
    this.view.classList.add("window");

    this.view.addEventListener("mousedown", () => this.focus());
    this.view.addEventListener("touchstart", () => this.focus());
  }
}

// utility
const toPx = (number: number): string => `${number}px`;

function getCursorPosition(
  e: MouseEvent | TouchEvent,
  key: "clientX" | "clientY"
): number {
  if (e instanceof MouseEvent) {
    return e[key];
  } else if (e instanceof TouchEvent && e.touches.length > 0) {
    return e.touches[0][key];
  }

  return 0;
}

// types
export interface WindowAction {
  drag?: boolean;
  resizeLeft?: boolean;
  resizeRight?: boolean;
  resizeTop?: boolean;
  resizeBottom?: boolean;
}
