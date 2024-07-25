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
    const values: string[] = collectObjectValuesForKey(
      propertyKey,
      stringEntryObjectConverter,
      [...objects.value.values()]
    );
    for (const existingValue of values) {
      if (propertyValues.value.has(existingValue)) continue;
      propertyValues.add(existingValue);
    }

    for (const displayedValue of propertyValues.value.values()) {
      if (values.includes(displayedValue) == false) {
        propertyValues.remove(displayedValue);
      }
    }
  }

  objects.subscribe(() => {
    collectValues();
  });

  return viewBuilder(propertyValues);
}
