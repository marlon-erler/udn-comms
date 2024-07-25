import * as React from "bloatless-react";

import { checkDoesObjectMatchSearch } from "../../Model/Utility/utility";

export default class SearchViewModel<T> {
  // data
  allObjects: React.ListState<T> | React.MapState<T>;
  getStringsOfObject: (object: T) => string[];

  // state
  appliedQuery: React.State<string> = new React.State("");
  searchInput: React.State<string> = new React.State("");
  matchingObjects: React.ListState<T>;

  // guards
  cannotApplySearch: React.State<boolean> = React.createProxyState(
    [this.searchInput, this.appliedQuery],
    () => this.searchInput.value == this.appliedQuery.value
  );

  // methods
  applySearch = (): void => {
    this.appliedQuery.value = this.searchInput.value;
    console.log("applying search");

    this.matchingObjects.clear();
    for (const object of this.allObjects.value.values()) {
      const doesMatch: boolean = this.checkDoesMatchSearch(object);
      if (doesMatch == false) continue;

      this.matchingObjects.add(object);
    }
  };

  // init
  constructor(
    allObjects: React.ListState<T> | React.MapState<T>,
    matchingObjects: React.ListState<T>,
    getStringsOfObject: (object: T) => string[]
  ) {
    this.allObjects = allObjects;
    this.matchingObjects = matchingObjects;
    this.getStringsOfObject = getStringsOfObject;

    // handle new objects
    this.allObjects.handleAddition((newObject: T) => {
      const doesMatch: boolean = this.checkDoesMatchSearch(newObject);
      if (doesMatch == false) {
        this.matchingObjects.remove(newObject);
      } else {
        if (this.matchingObjects.value.has(newObject)) return;
        this.matchingObjects.add(newObject);
        this.allObjects.handleRemoval(newObject, () => {
          this.matchingObjects.remove(newObject);
        });
      }
    });
  }

  // utility
  checkDoesMatchSearch = (object: T): boolean => {
    return checkDoesObjectMatchSearch(
      this.appliedQuery.value,
      this.getStringsOfObject,
      object
    );
  };
}
