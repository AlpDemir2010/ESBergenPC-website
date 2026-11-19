/** Returns a copy of `list` with one item shallow-merged. */
export function replaceAt<T>(list: T[], index: number, value: Partial<T>): T[] {
  return list.map((item, i) => (i === index ? { ...item, ...value } : item));
}
