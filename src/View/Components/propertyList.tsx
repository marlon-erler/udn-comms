import * as React from "bloatless-react";

import {
  StringEntryObject,
  collectObjectValuesForKey,
} from "../../Model/Utility/utility";

export function PropertyValueList<T>(
  propertyKey: string,
  stringEntryObjectConverter: (object: T) => StringEntryObject,
  objects: React.ListState<T> | React.MapState<T>,
  viewBuilder: (keys: React.ListState<string>) => HTMLElement
) {
  const propertyValues: React.ListState<string> = new React.ListState();

  function collectValues() {
    propertyValues.clear();
    const values: string[] = collectObjectValuesForKey(
      propertyKey,
      stringEntryObjectConverter,
      [...objects.value.values()]
    );
    propertyValues.add(...values);
  }

  objects.subscribe(() => {
    collectValues();
  });

  return viewBuilder(propertyValues);
}
