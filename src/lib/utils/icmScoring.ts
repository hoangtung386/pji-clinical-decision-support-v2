import type { ClinicalAssessment } from '../../types/index';
import type { Diagnosis } from '../../types/index';
import { DiagnosisStatus, CultureStatus } from '../enums/status';
import {
  SCORE_INFECTED_MIN,
  SCORE_INCONCLUSIVE_MIN,
  SCORE_MAJOR_CRITERIA,
  PROBABILITY_INFECTED,
  PROBABILITY_INCONCLUSIVE,
  PROBABILITY_NOT_INFECTED,
  PROBABILITY_MAJOR_CRITERIA,
  PROBABILITY_CULTURE_POSITIVE,
  PROBABILITY_MIN,
  PROBABILITY_MAX,
  MIN_POSITIVE_CULTURES,
} from '../constants/thresholds';

/**
 * ICM 2018 scoring algorithm - pure function.
 * Takes clinical data, returns diagnosis result.
 */
export function calculateDiagnosis(clinical: ClinicalAssessment): Diagnosis {
  // Major Criteria: sinus tract or 2 positive cultures (checkbox)
  if (clinical.symptoms.sinusTract || clinical.major.twoPositiveCultures) {
    return {
      score: SCORE_MAJOR_CRITERIA,
      probability: PROBABILITY_MAJOR_CRITERIA,
      status: DiagnosisStatus.INFECTED,
      reasoning: ['Tiêu chuẩn chính: Đường rò hoặc 2 mẫu cấy dương tính'],
    };
  }

  // Check bacterial culture samples (>= 2 positive with bacteria name)
  const positiveCultures = (clinical.cultureSamples ?? []).filter(
    (sample) =>
      sample.status === CultureStatus.POSITIVE &&
      sample.bacteriaName.trim() !== '',
  );

  if (positiveCultures.length >= MIN_POSITIVE_CULTURES) {
    const uniqueBacteria = [
      ...new Set(positiveCultures.map((s) => s.bacteriaName)),
    ];
    return {
      score: SCORE_MAJOR_CRITERIA,
      probability: PROBABILITY_CULTURE_POSITIVE,
      status: DiagnosisStatus.INFECTED,
      reasoning: [
        `Tiêu chuẩn chính: ${positiveCultures.length} mẫu cấy khuẩn dương tính`,
        `Vi khuẩn: ${uniqueBacteria.join(', ')}`,
      ],
    };
  }

  // Minor Criteria Scoring
  const score = 0;
  const reasoning: string[] = [];

  // Status Determination
  let status: DiagnosisStatus;
  let probability: number;

  if (score >= SCORE_INFECTED_MIN) {
    status = DiagnosisStatus.INFECTED;
    probability = PROBABILITY_INFECTED;
  } else if (score >= SCORE_INCONCLUSIVE_MIN) {
    status = DiagnosisStatus.INCONCLUSIVE;
    probability = PROBABILITY_INCONCLUSIVE;
  } else {
    status = DiagnosisStatus.NOT_INFECTED;
    probability = PROBABILITY_NOT_INFECTED;
  }

  // Adjust probability visually based on score
  probability = Math.min(
    PROBABILITY_MAX,
    Math.max(PROBABILITY_MIN, (score / 10) * 100),
  );

  return { score, probability, status, reasoning };
}
