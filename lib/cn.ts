export type ClassValue = string | false | null | undefined;

/** Tiny class-join helper — keeps conditional Tailwind strings readable. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
