// date
export function createTimestamp(): string {
  return new Date().toISOString();
}

// string
export function stringify(data: any): string {
  return JSON.stringify(data);
}

export function parse(string: string): any {
  return JSON.parse(string);
}
