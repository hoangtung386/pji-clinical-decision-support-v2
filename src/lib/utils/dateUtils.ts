import { ACUTE_CHRONIC_DAYS } from '../constants/thresholds';

export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diffMs = Math.abs(b.getTime() - a.getTime());
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isAcuteInfection(surgeryDate: string, symptomDate: string): boolean {
  if (!surgeryDate || !symptomDate) {
    return false;
  }
  return daysBetween(surgeryDate, symptomDate) < ACUTE_CHRONIC_DAYS;
}
