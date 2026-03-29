/** ICM 2018 scoring thresholds */
export const ACUTE_CHRONIC_DAYS = 21;

/** Diagnosis score thresholds */
export const SCORE_INFECTED_MIN = 6;
export const SCORE_INCONCLUSIVE_MIN = 4;

/** Diagnosis probability values */
export const PROBABILITY_INFECTED = 95;
export const PROBABILITY_INCONCLUSIVE = 65;
export const PROBABILITY_NOT_INFECTED = 15;
export const PROBABILITY_MAJOR_CRITERIA = 100;
export const PROBABILITY_CULTURE_POSITIVE = 95;
export const PROBABILITY_MIN = 5;
export const PROBABILITY_MAX = 99;
export const SCORE_MAJOR_CRITERIA = 99;

/** Lab alert thresholds */
export const LAB_THRESHOLDS = {
  wbc: 10,
  neu: 75,
  esr: 30,
  crp: 10,
} as const;

/** BMI conversion factor */
export const CM_TO_METERS = 100;

/** Default culture sample count */
export const DEFAULT_CULTURE_SAMPLES = 5;

/** Minimum positive cultures for major criteria */
export const MIN_POSITIVE_CULTURES = 2;
