// date
export function createTimestamp(): string {
  return new Date().toISOString();
}

// string
export function stringify(data: any): string {
  return JSON.stringify(data, null, 4);
}

export function parse(string: string): any {
  return JSON.parse(string);
}

// sort
export function localeCompare(a: string, b: string): number {
  return a.localeCompare(b);
}