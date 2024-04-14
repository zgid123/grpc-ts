/**
 * internal usage when developing
 */

export function sleep(second: number) {
  const start = new Date().getTime();
  let end = start;

  while (end < start + second * 1000) {
    end = new Date().getTime();
  }
}
