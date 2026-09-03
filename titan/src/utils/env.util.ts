export function envToBool(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}