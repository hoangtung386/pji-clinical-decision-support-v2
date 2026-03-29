import type { TreatmentPlan } from '../../../types/index';

export const DEFAULT_TREATMENT: TreatmentPlan = {
  pathogen: 'culture_negative',
  resistance: 'none',
  ivDrug: '',
  ivDosage: '',
  ivDuration: '',
  oralDrug: '',
  oralDosage: '',
  oralDuration: '',
  citation: '',
  confidence: 0,
};
