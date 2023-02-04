export function* range(s: number, e: number) {
  while (s <= e) yield s++;
}
