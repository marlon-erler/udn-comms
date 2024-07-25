import * as React from "bloatless-react";

export default class CoreViewModel {
  draggedFile: React.State<File | undefined> = new React.State<
    File | undefined
  >(undefined);
}
