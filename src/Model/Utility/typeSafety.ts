export const DATA_VERSION = "v2"

export function checkIsValidObject(object: any): boolean {
  return object.dataVersion == DATA_VERSION;
}

export interface ValidObject {
  dataVersion: "v2";
}