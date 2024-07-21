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

    if (Array.isArray(reference[key])) {
      // only check if array is not empty
      if (objectToCheck[key].length == 0) continue;

      // check first item of array
      const requiredType = typeof reference[key][0];
      const actualType = typeof objectToCheck[key][0];

      if (requiredType != actualType) return false;
    } else if (requiredType == "object") {
      // recurse into objects
      const doesNestedObjectMatch = checkMatchesObjectStructure(
        reference[key],
        objectToCheck[key]
      );
      if (doesNestedObjectMatch == false) return false;
    }
  }

  return true;
}

export interface ValidObject {
  dataVersion: "v2";
}
