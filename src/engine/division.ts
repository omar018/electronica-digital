import type { DivisionResult, DivisionStep } from './types';
import { toBinString } from './utils';

/**
 * RESTORING BINARY DIVISION (16 bits unsigned)
 * Dividend Q, Divisor M.
 * At the end: Quotient in Q, Remainder in A.
 */
export function restoringDivision(dividend: number, divisor: number): DivisionResult {
  if (divisor === 0) {
    throw new Error('División por cero no permitida');
  }

  const M = divisor & 0xffff;
  let Q = dividend & 0xffff;
  let A = 0; // 17-bit accumulator to track sign/carry

  const steps: DivisionStep[] = [];

  steps.push({
    cycle: 16,
    operation: 'Carga inicial',
    description: `A=0, Q=${toBinString(Q, 16)} (${Q}), M=${toBinString(M, 16)} (${M})`,
    A: toBinString(A, 16),
    Q: toBinString(Q, 16),
    M: toBinString(M, 16),
    restored: false,
  });

  for (let count = 16; count >= 1; count--) {
    // 1. Shift left [A, Q]
    const msbQ = (Q >> 15) & 1;
    A = ((A << 1) | msbQ) & 0x1ffff; // 17 bits
    Q = (Q << 1) & 0xffff;

    // 2. Subtract M from A
    let tempA = A - M;
    let restored = false;
    let opDesc = '';

    // 3. Test sign of A
    if (tempA < 0) {
      // Negative -> restore A and set Q_0 = 0
      restored = true;
      A = A & 0xffff; // keep A before subtraction (restored)
      Q = Q & 0xfffe; // Q_0 = 0
      opDesc = `Resta A-M < 0. Restauración realizada: A recuperado, Q₀=0`;
    } else {
      // Positive or zero -> keep subtraction and set Q_0 = 1
      A = tempA & 0xffff;
      Q = (Q | 1) & 0xffff; // Q_0 = 1
      opDesc = `Resta A-M ≥ 0. Resta aceptada, Q₀=1`;
    }

    steps.push({
      cycle: count - 1,
      operation: restored ? 'Despl. + Resta + Restaurar' : 'Despl. + Resta Exitosa',
      description: `Ciclo ${count}: Desplazamiento izq. ${opDesc}`,
      A: toBinString(A, 16),
      Q: toBinString(Q, 16),
      M: toBinString(M, 16),
      restored,
    });
  }

  return {
    dividendDec: dividend & 0xffff,
    dividendBin: toBinString(dividend, 16),
    divisorDec: M,
    divisorBin: toBinString(M, 16),
    quotientDec: Q,
    quotientBin: toBinString(Q, 16),
    remainderDec: A,
    remainderBin: toBinString(A, 16),
    isRestoring: true,
    steps,
  };
}

/**
 * NON-RESTORING BINARY DIVISION (16 bits unsigned)
 */
export function nonRestoringDivision(dividend: number, divisor: number): DivisionResult {
  if (divisor === 0) {
    throw new Error('División por cero no permitida');
  }

  const M = divisor & 0xffff;
  let Q = dividend & 0xffff;
  let A = 0; // Signed accumulator

  const steps: DivisionStep[] = [];

  steps.push({
    cycle: 16,
    operation: 'Carga inicial',
    description: `A=0, Q=${toBinString(Q, 16)} (${Q}), M=${toBinString(M, 16)} (${M})`,
    A: toBinString(A, 16),
    Q: toBinString(Q, 16),
    M: toBinString(M, 16),
    restored: false,
  });

  for (let count = 16; count >= 1; count--) {
    const isNegative = A < 0 || (A & 0x10000) !== 0;

    // 1. Shift left [A, Q]
    const msbQ = (Q >> 15) & 1;
    A = ((A << 1) | msbQ);

    let opDesc = '';
    // 2. If A was negative -> add M; if A was positive -> subtract M
    if (isNegative) {
      A = A + M;
      opDesc = `A previo era negativo: A = A + M`;
    } else {
      A = A - M;
      opDesc = `A previo era positivo: A = A - M`;
    }

    // 3. Test new sign of A
    const newIsNegative = A < 0 || (A & 0x10000) !== 0;
    if (newIsNegative) {
      Q = (Q & 0xfffe); // Q_0 = 0
      opDesc += ` -> A < 0, se establece Q₀=0`;
    } else {
      Q = (Q | 1); // Q_0 = 1
      opDesc += ` -> A ≥ 0, se establece Q₀=1`;
    }

    steps.push({
      cycle: count - 1,
      operation: isNegative ? 'Despl. + Suma' : 'Despl. + Resta',
      description: `Ciclo ${count}: ${opDesc}`,
      A: toBinString(A & 0xffff, 16),
      Q: toBinString(Q & 0xffff, 16),
      M: toBinString(M, 16),
      restored: false,
    });
  }

  // Final correction if A is negative
  if (A < 0) {
    A = A + M;
  }
  A = A & 0xffff;
  Q = Q & 0xffff;

  return {
    dividendDec: dividend & 0xffff,
    dividendBin: toBinString(dividend, 16),
    divisorDec: M,
    divisorBin: toBinString(M, 16),
    quotientDec: Q,
    quotientBin: toBinString(Q, 16),
    remainderDec: A,
    remainderBin: toBinString(A, 16),
    isRestoring: false,
    steps,
  };
}
