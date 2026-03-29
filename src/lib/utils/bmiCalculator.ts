import { CM_TO_METERS } from '../constants/thresholds';

export function calculateBmi(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) {
    return 0;
  }
  const heightM = heightCm / CM_TO_METERS;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}
