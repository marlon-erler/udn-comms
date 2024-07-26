import * as React from "bloatless-react";

export const StringToTextSpan: React.StateItemConverter<string> = (
  string: string
) => {
  return <span>{string}</span>
};
