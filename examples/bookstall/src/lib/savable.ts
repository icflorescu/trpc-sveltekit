export function savable<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'string') {
        const adjustedValue = value.trim();
        return [key, adjustedValue === '' ? null : adjustedValue];
      }
      return [key, value];
    })
  ) as T;
}
