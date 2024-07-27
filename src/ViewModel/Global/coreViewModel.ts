import * as React from "bloatless-react";

export default class CoreViewModel {
  // drag&drop
  draggedObject: React.State<any> = new React.State<any>(undefined);

  // suggestions
  boardSearchSuggestions: React.ListState<string> = new React.ListState();
}
