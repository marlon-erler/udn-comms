import * as React from "bloatless-react";

export function Option(text: string, value: string, selectedOnCreate: boolean) {
  return (
    <option value={value} toggle:selected={selectedOnCreate}>
      {text}
    </option>
  );
}

export const StringToOption: React.StateItemConverter<string> = (
  string: string
) => {
  return Option(string, string, false);
};

export const VersionIdToOption: React.StateItemConverter<string> = (
  versionId: string
) => {
  const [date, rest] = versionId.split("T");
  const [time] = rest.split(".");
  const readableName = `${date} ${time}`;
  return Option(readableName, versionId, false);
};
