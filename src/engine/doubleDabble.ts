import type {
  DoubleDabbleResult,
  DoubleDabbleStep,
  ReverseDoubleDabbleResult,
  ReverseDoubleDabbleStep,
} from './types';
import { toNibbleString, toBinString } from './utils';

/**
 * DOUBLE DABBLE (Binary to BCD) - Up to 16 bits
 */
export function binaryToBcdDoubleDabble(num: number): DoubleDabbleResult {
  const clampedNum = num & 0xffff;
  const inputBinary = toBinString(clampedNum, 16);

  // 5 BCD digits: [TenThousands, Thousands, Hundreds, Tens, Units]
  const bcd: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  let binBits = inputBinary.split('').map(b => parseInt(b, 10));

  const steps: DoubleDabbleStep[] = [];

  const getBcdBinary = (): [string, string, string, string, string] => [
    toNibbleString(bcd[0]),
    toNibbleString(bcd[1]),
    toNibbleString(bcd[2]),
    toNibbleString(bcd[3]),
    toNibbleString(bcd[4]),
  ];

  // Initial step
  steps.push({
    cycle: 0,
    operation: 'Inicialización',
    description: 'Carga inicial del número binario y registros BCD en cero',
    binaryRegister: binBits.join(''),
    bcdDigits: [...bcd],
    bcdBinary: getBcdBinary(),
  });

  for (let cycle = 1; cycle <= 16; cycle++) {
    // 1. Check if any BCD column >= 5, add 3
    let adjustments: string[] = [];
    const colNames = ['Decenas de mil', 'Unidades de mil', 'Centenas', 'Decenas', 'Unidades'];

    for (let i = 0; i < 5; i++) {
      if (bcd[i] >= 5) {
        const oldVal = bcd[i];
        bcd[i] += 3;
        adjustments.push(`${colNames[i]} (${oldVal} ≥ 5) +3 = ${bcd[i]} [${toNibbleString(bcd[i])}]`);
      }
    }

    if (adjustments.length > 0) {
      steps.push({
        cycle,
        operation: 'Suma +3 (>4)',
        description: `Ajuste BCD: ${adjustments.join(', ')}`,
        binaryRegister: binBits.join(''),
        bcdDigits: [...bcd],
        bcdBinary: getBcdBinary(),
        adjustmentMade: adjustments.join(' | '),
      });
    }

    // 2. Shift left entire register by 1 bit
    const nextBit = binBits[0];
    binBits = binBits.slice(1);
    binBits.push(0); // padded

    let carry = nextBit;
    for (let i = 4; i >= 0; i--) {
      const shifted = ((bcd[i] << 1) | carry) & 0x1f;
      bcd[i] = shifted & 0x0f;
      carry = (shifted >> 4) & 0x01;
    }

    steps.push({
      cycle,
      operation: 'Desplazamiento Izq.',
      description: `Ciclo ${cycle}/16: Desplazamiento a la izquierda de todos los registros`,
      binaryRegister: binBits.join(''),
      bcdDigits: [...bcd],
      bcdBinary: getBcdBinary(),
    });
  }

  const bcdString = bcd.join('');
  const bcdFormatted = getBcdBinary().join(' ');

  return {
    inputDecimal: clampedNum,
    inputBinary,
    bcdString,
    bcdFormatted,
    steps,
  };
}

/**
 * REVERSE DOUBLE DABBLE (BCD to Binary) - Up to 16 bits (0 to 65535)
 */
export function bcdToBinaryDoubleDabble(
  digits: [number, number, number, number, number]
): ReverseDoubleDabbleResult {
  const bcd: [number, number, number, number, number] = [...digits];
  const steps: ReverseDoubleDabbleStep[] = [];
  let binaryBits: number[] = []; // bits shifted out of BCD go into MSB of binary register

  const getBcdBinary = (): [string, string, string, string, string] => [
    toNibbleString(bcd[0]),
    toNibbleString(bcd[1]),
    toNibbleString(bcd[2]),
    toNibbleString(bcd[3]),
    toNibbleString(bcd[4]),
  ];

  const getBinaryString = (): string => {
    return binaryBits.join('').padStart(16, '0');
  };

  steps.push({
    cycle: 0,
    operation: 'Inicialización',
    description: `Dígitos BCD de entrada: ${bcd.join(' ')}`,
    binaryRegister: getBinaryString(),
    bcdDigits: [...bcd],
    bcdBinary: getBcdBinary(),
  });

  for (let cycle = 1; cycle <= 16; cycle++) {
    // 1. Shift right entire BCD register by 1 bit
    let carry = 0;
    for (let i = 0; i < 5; i++) {
      const current = bcd[i];
      const newCarry = current & 1;
      bcd[i] = ((current >> 1) | (carry << 3)) & 0x0f;
      carry = newCarry;
    }
    // The bit that drops off the units column goes into the MSB of the binary register
    binaryBits.unshift(carry);

    steps.push({
      cycle,
      operation: 'Desplazamiento Der.',
      description: `Ciclo ${cycle}/16: Desplaza a la derecha. Bit ${carry} extraído hacia binario`,
      binaryRegister: getBinaryString(),
      bcdDigits: [...bcd],
      bcdBinary: getBcdBinary(),
    });

    // 2. If cycle < 16, check if any BCD column >= 8, subtract 3
    if (cycle < 16) {
      let adjustments: string[] = [];
      const colNames = ['Decenas de mil', 'Unidades de mil', 'Centenas', 'Decenas', 'Unidades'];

      for (let i = 0; i < 5; i++) {
        if (bcd[i] >= 8) {
          const oldVal = bcd[i];
          bcd[i] -= 3;
          adjustments.push(`${colNames[i]} (${oldVal} ≥ 8) -3 = ${bcd[i]} [${toNibbleString(bcd[i])}]`);
        }
      }

      if (adjustments.length > 0) {
        steps.push({
          cycle,
          operation: 'Resta -3 (≥8)',
          description: `Ajuste BCD inverso: ${adjustments.join(', ')}`,
          binaryRegister: getBinaryString(),
          bcdDigits: [...bcd],
          bcdBinary: getBcdBinary(),
          adjustmentMade: adjustments.join(' | '),
        });
      }
    }
  }

  const outputBinary = getBinaryString();
  const outputDecimal = parseInt(outputBinary, 2);

  return {
    inputBcdDigits: digits,
    inputBcdFormatted: digits.map(d => toNibbleString(d)).join(' '),
    outputDecimal,
    outputBinary,
    steps,
  };
}
