import type { BoothResult, BoothStep } from './types';
import { toBinString, toBinString32 } from './utils';

/**
 * SIGNED BOOTH MULTIPLICATION (16 bits)
 * Operates in Two's Complement. Multiplicand M and Multiplier Q (-32768 to 32767).
 * Result is 32-bit signed integer.
 */
export function signedBoothMultiply(mVal: number, qVal: number): BoothResult {
  // Normalize to 16 bits signed
  let A = 0; // 16 bits
  let Q = qVal & 0xffff;
  let Q_prev = 0;
  const M = mVal & 0xffff;

  const steps: BoothStep[] = [];

  // Helper to get 16-bit signed decimal
  const toSigned16 = (val: number): number => {
    val = val & 0xffff;
    return val >= 0x8000 ? val - 0x10000 : val;
  };

  steps.push({
    cycle: 16,
    operation: 'Carga inicial',
    description: `A=0, Q=${toBinString(Q, 16)} (${toSigned16(Q)}), Q₋₁=0, M=${toBinString(M, 16)} (${toSigned16(M)})`,
    A: toBinString(A, 16),
    Q: toBinString(Q, 16),
    Q_prev: '0',
    A_dec: 0,
    Q_dec: toSigned16(Q),
  });

  for (let count = 16; count >= 1; count--) {
    const q0 = Q & 1;
    let opDesc = 'Sin suma/resta';

    if (q0 > Q_prev) {
      // 10 -> A = A - M
      A = (A - M) & 0xffff;
      opDesc = 'A = A - M (Resta por bits 10)';
    } else if (q0 < Q_prev) {
      // 01 -> A = A + M
      A = (A + M) & 0xffff;
      opDesc = 'A = A + M (Suma por bits 01)';
    }

    // Arithmetic Shift Right [A, Q, Q_prev]
    const newQ_prev = q0;
    const a0 = A & 1;
    const aSign = (A & 0x8000) ? 1 : 0;

    Q = ((Q >>> 1) | (a0 << 15)) & 0xffff;
    A = ((A >>> 1) | (aSign << 15)) & 0xffff;
    Q_prev = newQ_prev;

    steps.push({
      cycle: count - 1,
      operation: opDesc,
      description: `Ciclo ${count}: Q₀=${q0}, Q₋₁=${newQ_prev}. ${opDesc}. Desplazamiento aritmético a la derecha`,
      A: toBinString(A, 16),
      Q: toBinString(Q, 16),
      Q_prev: String(Q_prev),
      A_dec: toSigned16(A),
      Q_dec: toSigned16(Q),
    });
  }

  // 32-bit result
  const bigA = BigInt(A);
  const bigQ = BigInt(Q);
  const productBits = (bigA << 16n) | bigQ;
  const productBin = toBinString32(productBits);

  // Parse signed 32-bit
  let productDec = BigInt(mVal) * BigInt(qVal);

  return {
    multiplicandDec: mVal,
    multiplicandBin: toBinString(mVal, 16),
    multiplierDec: qVal,
    multiplierBin: toBinString(qVal, 16),
    signed: true,
    productBin,
    productDec,
    steps,
  };
}

/**
 * UNSIGNED BOOTH / SHIFT-ADD MULTIPLICATION (16 bits)
 * Operates on unsigned integers (0 to 65535).
 * Matches user's C++ unsigned_booth_multiply.
 */
export function unsignedBoothMultiply(mVal: number, qVal: number): BoothResult {
  let A = 0;
  let Q = qVal & 0xffff;
  let Cf = 0;
  const M = mVal & 0xffff;

  const steps: BoothStep[] = [];

  steps.push({
    cycle: 16,
    operation: 'Carga inicial',
    description: `A=0, Q=${toBinString(Q, 16)} (${Q}), Cf=0, M=${toBinString(M, 16)} (${M})`,
    A: toBinString(A, 16),
    Q: toBinString(Q, 16),
    Cf: '0',
    A_dec: 0,
    Q_dec: Q,
  });

  for (let count = 16; count >= 1; count--) {
    const q0 = Q & 1;
    let opDesc = 'Solo desplazamiento';

    if (q0 === 1) {
      const sum = A + M;
      A = sum & 0xffff;
      Cf = (sum > 0xffff) ? 1 : 0;
      opDesc = `A = A + M (Suma por Q₀=1, Cf=${Cf})`;
    }

    // Logical shift right [Cf, A, Q]
    const a0 = A & 1;
    Q = ((Q >>> 1) | (a0 << 15)) & 0xffff;
    A = ((A >>> 1) | (Cf << 15)) & 0xffff;
    Cf = 0;

    steps.push({
      cycle: count - 1,
      operation: opDesc,
      description: `Ciclo ${count}: Q₀=${q0}. ${opDesc}. Desplazamiento lógico a la derecha`,
      A: toBinString(A, 16),
      Q: toBinString(Q, 16),
      Cf: String(Cf),
      A_dec: A,
      Q_dec: Q,
    });
  }

  const bigA = BigInt(A);
  const bigQ = BigInt(Q);
  const productBits = (bigA << 16n) | bigQ;
  const productBin = toBinString32(productBits);
  const productDec = BigInt(mVal & 0xffff) * BigInt(qVal & 0xffff);

  return {
    multiplicandDec: mVal & 0xffff,
    multiplicandBin: toBinString(mVal, 16),
    multiplierDec: qVal & 0xffff,
    multiplierBin: toBinString(qVal, 16),
    signed: false,
    productBin,
    productDec,
    steps,
  };
}
