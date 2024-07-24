import { checkIsValidObject, checkMatchesObjectStructure } from "./typeSafety";

// date
export function createTimestamp(): string {
  return new Date().toISOString();
}

// handlers
export type Handler<T> = (item: T) => void;

export class HandlerManager<T> {
  handlers: Set<Handler<T>> = new Set();

  // manage
  addHandler = (handler: Handler<T>): void => {
    this.handlers.add(handler);
  };

  deleteHandler = (handler: Handler<T>): void => {
    this.handlers.delete(handler);
  };

  // trigger
  trigger = (item: T): void => {
    for (const handler of this.handlers) {
      handler(item);
    }
  };
}

// objects
export type StringEntryObject = { [key: string]: string | undefined };

export function filterObjectsByStringEntries<T>(
  reference: StringEntryObject,
  converter: (T) => StringEntryObject,
  objects: T[]
): Set<T> {
  const matches: Set<T> = new Set();

  object_loop: for (const object of objects) {
    const doesMatch: boolean = checkDoesObjectMatchReference(
      reference,
      converter(object)
    );
    if (doesMatch) matches.add(object);
  }

  return matches;
}

export function checkDoesObjectMatchReference<T>(
  reference: StringEntryObject,
  stringEntryObject: StringEntryObject
): boolean {
  reference_entry_loop: for (const referenceEntry of Object.entries(
    reference
  )) {
    const [referenceKey, referenceValue] = referenceEntry;
    const stringEntryObjectValue: string | undefined =
      stringEntryObject[referenceKey];

    if (referenceValue == undefined) return false;

    if (referenceValue[0] == "-") {
      const strippedReferenceValue: string = referenceValue.substring(1);
      // property may not exist
      if (
        strippedReferenceValue == "" &&
        stringEntryObjectValue != undefined &&
        stringEntryObjectValue != ""
      ) {
        return false;
      }

      // property may not match
      if (stringEntryObjectValue == strippedReferenceValue) {
        return false;
      }
    } else {
      // property must exist but be anything
      if (
        referenceValue == "" &&
        (stringEntryObjectValue == undefined || stringEntryObjectValue == "")
      ) {
        return false;
      } else if (referenceValue == "") {
        continue reference_entry_loop;
      }

      // property must match
      if (stringEntryObjectValue != referenceValue) {
        return false;
      }
    }
  }
  return true;
}

export function collectObjectValuesForKey<T>(
  key: string,
  converter: (object: T) => StringEntryObject,
  objects: T[]
): string[] {
  const values: Set<string> = new Set();

  for (const object of objects) {
    const stringEntryObject: StringEntryObject = converter(object);
    const stringEntryObjectValue: string | undefined = stringEntryObject[key];
    if (stringEntryObjectValue == undefined || stringEntryObjectValue == "")
      continue;

    values.add(stringEntryObjectValue);
  }

  return [...values.values()].sort(localeCompare);
}

// sorting
export class IndexManager<T> {
  private itemToString: (item: T) => string;

  sortedStrings: string[] = [];

  // methods
  update = (items: T[]): void => {
    this.sortedStrings = [];

    let strings: string[] = [];
    for (const item of items) {
      const string: string = this.itemToString(item);
      strings.push(string);
    }

    this.sortedStrings = strings.sort(localeCompare);
  };

  getIndex = (item: T): number => {
    const string: string = this.itemToString(item);
    const index: number = this.sortedStrings.indexOf(string);
    return index;
  };

  // init
  constructor(itemToString: (item: T) => string) {
    this.itemToString = itemToString;
  }
}

// string
export function stringify(data: any): string {
  return JSON.stringify(data, null, 4);
}

export function padZero(string: string | undefined, length: number): string {
  return (string ?? "").padStart(length, "0");
}

export function parse(string: string): any {
  try {
    return JSON.parse(string);
  } catch {
    return {};
  }
}

export function parseValidObject<T>(string: string, reference: T): T | null {
  const parsed: any = parse(string);
  if (checkIsValidObject(parsed) == false) return null;

  const doesMatchReference: boolean = checkMatchesObjectStructure(
    parsed,
    reference
  );
  if (doesMatchReference == false) return null;

  return parsed;
}

// sort
export function localeCompare(a: string, b: string): number {
  return a.localeCompare(b);
}
