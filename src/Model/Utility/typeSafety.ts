export const DATA_VERSION = "v2";

export function checkIsValidObject(object: any): boolean {
  return object.dataVersion == DATA_VERSION;
}

export function checkMatchesObjectStructure(
  objectToCheck: any,
  reference: any
): boolean {
  for (const key of Object.keys(reference)) {
    const requiredType = typeof reference[key];
    const actualType = typeof objectToCheck[key];
    if (requiredType != actualType) return false;

    // recurse into objects
    if (requiredType != "object") continue;
    const doesNestedObjectMatch = checkMatchesObjectStructure(
      reference[key],
      objectToCheck[key]
    );
    if (doesNestedObjectMatch == false) return false;
  }

  return true;
}

export interface ValidObject {
  dataVersion: "v2";
}
