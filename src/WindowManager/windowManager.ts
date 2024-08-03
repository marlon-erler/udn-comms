import "./windowManager.css";

export default class WindowManager {
  root: HTMLElement;
  windows: Set<Window> = new Set();
  focusedWindow: Window | undefined = undefined;
  highestZIndex: number = 0;

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
    })

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

  // init
  constructor(root: HTMLElement) {
    this.root = root;
    root.classList.add("window-manager");
  }
}

export class Window {
  view: HTMLElement;
  windowManager: WindowManager | undefined = undefined;

  // position etc
  positionX: number = 50;
  positionY: number = 50;

  height: number = 200;
  width: number = 300;

  // focus
  get isFocused(): boolean {
    console.log(
      this.windowManager,
      this.windowManager!.focusedWindow,
      this.windowManager!.focusedWindow == this
    );
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
  show = (windowManager: WindowManager): void => {
    this.windowManager = windowManager;
    windowManager.showWindow(this);

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

  // view
  setPosition = (x: number, y: number): void => {
    this.positionX = x;
    this.positionY = y;
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

  // moving
  getRelativeCursorPosition = (
    e: MouseEvent | TouchEvent
  ): [number, number] | undefined => {
    if (this.windowManager == undefined) return;

    const cursorFromLeftScreenEdge: number = getCursorPosition(e, "clientX");
    const cursorFromLeftCanvasEdge: number =
      cursorFromLeftScreenEdge - this.windowManager.leftEdge;

    const cursorFromUpperScreenEdge: number = getCursorPosition(e, "clientY");
    const cursorFromUpperCanvasEdge: number =
      cursorFromUpperScreenEdge - this.windowManager.upperEdge;

    return [cursorFromLeftCanvasEdge, cursorFromUpperCanvasEdge];
  };

  getWindowOffset = (
    e: MouseEvent | TouchEvent
  ): [number, number] | undefined => {
    const cursorPosition: [number, number] | undefined =
      this.getRelativeCursorPosition(e);
    if (cursorPosition == undefined) return;
    const [cursorFromLeftCanvasEdge, cursorFromUpperCanvasEdge] =
      cursorPosition;

    const leftWindowEdge: number = this.view.offsetLeft;
    const leftOffset: number = cursorFromLeftCanvasEdge - leftWindowEdge;

    const upperWindowEdge: number = this.view.offsetTop;
    const topOffset: number = cursorFromUpperCanvasEdge - upperWindowEdge;

    return [leftOffset, topOffset];
  };

  registerDragger = (dragger: HTMLElement): void => {
    let leftWindowOffset: number = 0;
    let topWindowOffset: number = 0;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      // get offset
      const windowOffset: [number, number] | undefined =
        this.getWindowOffset(e);
      if (windowOffset == undefined) return;
      [leftWindowOffset, topWindowOffset] = windowOffset;

      // handle drag
      document.body.addEventListener("mousemove", handleDrag);
      document.body.addEventListener("touchmove", handleDrag);

      // end
      document.body.addEventListener("mouseup", handleEnd, { once: true });
      document.body.addEventListener("touchend", handleEnd, { once: true });
    };

    const handleDrag = (e: MouseEvent | TouchEvent): void => {
      const cursorPosition: [number, number] | undefined =
        this.getRelativeCursorPosition(e);
      if (cursorPosition == undefined) return;
      const [cursorFromLeftCanvasEdge, cursorFromUpperCanvasEdge] =
        cursorPosition;

      const newLeftEdge = cursorFromLeftCanvasEdge - leftWindowOffset;
      const newUpperEdge = cursorFromUpperCanvasEdge - topWindowOffset;

      this.setPosition(newLeftEdge, newUpperEdge);
    };

    const handleEnd = () => {
      document.body.removeEventListener("mousemove", handleDrag);
      document.body.removeEventListener("touchmove", handleDrag);
    };

    // start
    dragger.addEventListener("mousedown", handleStart);
    dragger.addEventListener("touchstart", handleStart);
  };

  // init
  constructor(viewBuilder: (window: Window) => HTMLElement) {
    this.view = viewBuilder(this);
    this.view.classList.add("window");

    this.view.addEventListener("mousedown", () => this.focus());
    this.view.addEventListener("touchstart", () => this.focus());
  }
}

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
