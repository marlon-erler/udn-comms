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

// filters
export function filterObjectsByStringEntries(reference: {[key: string]: string}, objects: any[]): any[] {
  const matches: any[] = [];

  object_loop: for (const object of objects) {
    reference_entry_loop: for (const referenceEntry of Object.entries(reference)) {
      const [key, value] = referenceEntry;
      if (object[key] != value) continue object_loop
    }
    matches.push(object);
  }

  return matches;
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
