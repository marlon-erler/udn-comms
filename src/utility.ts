export function stringify(data: any): string {
    return JSON.stringify(data);
}

export function parse(string: string): any {
    return JSON.parse(string);
}