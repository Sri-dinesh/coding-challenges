const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const BASE = ALPHABET.length;

export function toBase62(num: number): string {
  if (num == 0) return ALPHABET[0];
  let result = "";
  let n = num;
  while (n > 0) {
    result = ALPHABET[n % BASE] + result;
    n = Math.floor(n / BASE);
  }

  return result;
}

export function fromBase62(str: string): number {
  return str.split("").reduce((acc, char) => {
    return acc * BASE + ALPHABET.indexOf(char);
  }, 0);
}

export function generateShortCode(id: number, minLength = 6): string {
  const code = toBase62(id);
  return code.padStart(minLength, ALPHABET[0]);
}
