import * as React from "bloatless-react";

export function Option(text: string, value: string, selectedOnCreate: boolean) {
  return (
    <option value={value} toggle:selected={selectedOnCreate}>
      {text}
    </option>
  );
}
