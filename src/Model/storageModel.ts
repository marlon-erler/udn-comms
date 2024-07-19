// this file is responsible for reading and writing persistent data; all storage shall be handled by this file.

import { parse, stringify } from "../utility";

// basic
export function store(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function restore(key: string): string | null {
  return localStorage.getItem(key);
}

// array
export function storeArray(key: string, value: any[]): void {
    const valueString = stringify(value);
    store(key, valueString);
}

export function restoreArray(key: string): any[] | null {
    const valueString = restore(key);
    if (!valueString) return null;
    
    const parsed = parse(valueString);
    if (!Array.isArray(parsed)) return null;

    return parsed;
}