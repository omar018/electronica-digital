/**
 * Formats a number to an unsigned binary string padded to `bits` length.
 */
export function toBinString(num: number, bits: number = 16): string {
  const mask = (1 << bits) - 1;
  const unsigned = (num & mask) >>> 0;
  return unsigned.toString(2).padStart(bits, '0');
}

/**
 * Formats a 32-bit integer (can be BigInt) to binary string.
 */
export function toBinString32(num: number | bigint): string {
  const big = BigInt(num);
  const mask = (BigInt(1) << BigInt(32)) - BigInt(1);
  const unsigned = big & mask;
  return unsigned.toString(2).padStart(32, '0');
}

/**
 * Formats a 4-bit nibble to binary string.
 */
export function toNibbleString(nibble: number): string {
  return (nibble & 0xf).toString(2).padStart(4, '0');
}

/**
 * Converts a 16-bit binary string (two's complement) to signed integer.
 */
export function parse16BitSigned(binStr: string): number {
  const clean = binStr.replace(/\s+/g, '').padStart(16, '0').slice(-16);
  const unsigned = parseInt(clean, 2);
  if (clean[0] === '1') {
    return unsigned - 0x10000;
  }
  return unsigned;
}

/**
 * Converts a 16-bit binary string to unsigned integer.
 */
export function parse16BitUnsigned(binStr: string): number {
  const clean = binStr.replace(/\s+/g, '');
  return parseInt(clean, 2) & 0xffff;
}

/**
 * Parses user input which can be decimal (e.g. "142", "-7") or binary (e.g. "b1011", "00001011").
 */
export function parseInput(input: string, isSigned: boolean = false): { dec: number; bin: string; valid: boolean; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { dec: 0, bin: '0'.repeat(16), valid: false, error: 'Entrada vacía' };
  }

  let isBinary = false;
  let raw = trimmed;

  if (trimmed.toLowerCase().startsWith('b')) {
    isBinary = true;
    raw = trimmed.slice(1);
  } else if (/^[01]+$/.test(trimmed) && trimmed.length > 5) {
    // If it looks like a binary bitstream
    isBinary = true;
  }

  if (isBinary) {
    if (!/^[01]+$/.test(raw)) {
      return { dec: 0, bin: '0'.repeat(16), valid: false, error: 'Cadena binaria contiene caracteres inválidos' };
    }
    if (raw.length > 16) {
      return { dec: 0, bin: '0'.repeat(16), valid: false, error: 'Máximo 16 bits permitidos' };
    }
    const bin16 = raw.padStart(16, isSigned && raw[0] === '1' && raw.length === 16 ? '1' : '0');
    const dec = isSigned ? parse16BitSigned(bin16) : parse16BitUnsigned(bin16);
    return { dec, bin: bin16, valid: true };
  } else {
    const num = parseInt(raw, 10);
    if (isNaN(num)) {
      return { dec: 0, bin: '0'.repeat(16), valid: false, error: 'Número decimal inválido' };
    }
    if (isSigned) {
      if (num < -32768 || num > 32767) {
        return { dec: 0, bin: '0'.repeat(16), valid: false, error: 'Rango con signo de 16 bits: -32768 a 32767' };
      }
      const bin16 = toBinString(num, 16);
      return { dec: num, bin: bin16, valid: true };
    } else {
      if (num < 0 || num > 65535) {
        return { dec: 0, bin: '0'.repeat(16), valid: false, error: 'Rango sin signo de 16 bits: 0 a 65535' };
      }
      const bin16 = toBinString(num, 16);
      return { dec: num, bin: bin16, valid: true };
    }
  }
}
