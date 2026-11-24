export type InputBase = 'dec' | 'bin';

export interface BaseStep {
  cycle: number;
  operation: string;
  description: string;
}

export interface DoubleDabbleStep extends BaseStep {
  binaryRegister: string;
  bcdDigits: [number, number, number, number, number]; // 5 digits: TenThousands, Thousands, Hundreds, Tens, Units
  bcdBinary: [string, string, string, string, string];
  adjustmentMade?: string;
}

export interface DoubleDabbleResult {
  inputDecimal: number;
  inputBinary: string;
  bcdString: string;
  bcdFormatted: string;
  steps: DoubleDabbleStep[];
}

export interface ReverseDoubleDabbleStep extends BaseStep {
  binaryRegister: string;
  bcdDigits: [number, number, number, number, number];
  bcdBinary: [string, string, string, string, string];
  adjustmentMade?: string;
}

export interface ReverseDoubleDabbleResult {
  inputBcdDigits: [number, number, number, number, number];
  inputBcdFormatted: string;
  outputDecimal: number;
  outputBinary: string;
  steps: ReverseDoubleDabbleStep[];
}

export interface BoothStep extends BaseStep {
  A: string; // 16 bits
  Q: string; // 16 bits
  Q_prev?: string; // 1 bit (Q_-1 for signed)
  Cf?: string; // 1 bit (Carry for unsigned)
  A_dec: number;
  Q_dec: number;
}

export interface BoothResult {
  multiplicandDec: number;
  multiplicandBin: string;
  multiplierDec: number;
  multiplierBin: string;
  signed: boolean;
  productBin: string; // 32 bits
  productDec: number | bigint;
  steps: BoothStep[];
}

export interface DivisionStep extends BaseStep {
  A: string; // 16 or 17 bits
  Q: string; // 16 bits
  M: string; // 16 bits
  restored?: boolean;
}

export interface DivisionResult {
  dividendDec: number;
  dividendBin: string;
  divisorDec: number;
  divisorBin: string;
  quotientDec: number;
  quotientBin: string;
  remainderDec: number;
  remainderBin: string;
  isRestoring: boolean;
  steps: DivisionStep[];
}
