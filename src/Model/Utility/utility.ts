import { checkIsValidObject, checkMatchesObjectStructure } from "./typeSafety";

// date
export function createTimestamp(): string {
  return new Date().toISOString();
}

// string
export function stringify(data: any): string {
  return JSON.stringify(data, null, 4);
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
