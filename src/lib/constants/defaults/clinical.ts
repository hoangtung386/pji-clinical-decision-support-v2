import type { ClinicalAssessment, TestItem, CultureSample } from '../../../types/index';
import { DiagnosisStatus, CultureStatus } from '../../enums/status';

export const DEFAULT_HEMATOLOGY_TESTS: TestItem[] = [
  { id: 'ht_1', name: 'Bạch cầu', result: '', normalRange: '', unit: 'Tế bào/Vi trường' },
  { id: 'ht_2', name: '%NEUT', result: '', normalRange: '40 - 74', unit: '%' },
  { id: 'ht_3', name: 'Máu lắng', result: '', normalRange: '< 10', unit: 'mm' },
];

export const DEFAULT_BIOCHEMISTRY_TESTS: TestItem[] = [
  { id: 'bc_1', name: 'Định lượng CRP', result: '', normalRange: '0 - 5', unit: 'mg/l' },
  { id: 'bc_2', name: 'D-Dimer', result: '', normalRange: '< 0.5', unit: 'μg/mL' },
  { id: 'bc_3', name: 'Alpha Defensin', result: '', normalRange: '< 5.2', unit: 'μg/mL' },
];

export const DEFAULT_FLUID_TESTS: TestItem[] = [
  { id: 'ft_1', name: 'Leukocyte Esterase', result: '', normalRange: '', unit: 'cells/μL' },
];

export const DEFAULT_OTHER_TESTS: TestItem[] = [
  { id: 'ot_1', name: 'Định lượng Glucose', result: '', normalRange: '4.1 - 5.6', unit: 'mmol/l' },
  { id: 'ot_2', name: 'Định lượng Urê máu', result: '', normalRange: '2.8 - 7.2', unit: 'mmol/l' },
  { id: 'ot_3', name: 'Định lượng Creatinin', result: '', normalRange: '59 - 104', unit: 'µmol/l' },
  { id: 'ot_4', name: 'Định lượng Albumin', result: '', normalRange: '35 - 52', unit: 'g/L' },
  { id: 'ot_5', name: 'Định lượng Protein toàn phần', result: '', normalRange: '66 - 83', unit: 'g/L' },
  { id: 'ot_6', name: 'Điện giải đồ (Na, K, Cl)', result: '', normalRange: '', unit: 'mmol/L' },
  { id: 'ot_7', name: 'Na+', result: '', normalRange: '135 - 145', unit: 'mmol/L' },
  { id: 'ot_8', name: 'K+', result: '', normalRange: '3.5 - 5.0', unit: 'mmol/L' },
  { id: 'ot_9', name: 'Cl-', result: '', normalRange: '', unit: 'mmol/L' },
  { id: 'ot_10', name: 'Định lượng Canxi toàn phần', result: '', normalRange: '2.2 - 2.65', unit: 'mmol/L' },
  { id: 'ot_11', name: 'Định lượng HbA1c', result: '', normalRange: '4 - 6.2', unit: '%' },
  { id: 'ot_12', name: 'Bạch cầu (Dịch)', result: '', normalRange: '', unit: 'Tế bào/Vi trường' },
  { id: 'ot_13', name: '%NEUT (Dịch)', result: '', normalRange: '', unit: '%' },
  { id: 'ot_14', name: 'Định lượng CRP (Dịch)', result: '', normalRange: '', unit: 'mg/l' },
];

export const DEFAULT_FLUID_ANALYSIS: TestItem[] = [
  { id: 'fa_1', name: 'Cấy khuẩn', result: '', normalRange: '', unit: 'CFU/mL' },
  { id: 'fa_2', name: 'Nhuộm Gram', result: '', normalRange: '', unit: '' },
];

export const DEFAULT_CULTURE_SAMPLES: CultureSample[] = [
  { sampleNumber: 1, status: CultureStatus.NEGATIVE, bacteriaName: '' },
  { sampleNumber: 2, status: CultureStatus.NEGATIVE, bacteriaName: '' },
  { sampleNumber: 3, status: CultureStatus.NEGATIVE, bacteriaName: '' },
  { sampleNumber: 4, status: CultureStatus.NEGATIVE, bacteriaName: '' },
  { sampleNumber: 5, status: CultureStatus.NEGATIVE, bacteriaName: '' },
];

export const DEFAULT_CLINICAL: ClinicalAssessment = {
  major: { sinusTract: false, twoPositiveCultures: false },
  symptoms: {
    fever: false,
    sinusTract: false,
    pain: false,
    swelling: false,
    drainage: false,
  },
  imaging: { description: '', images: [] },
  hematologyTests: DEFAULT_HEMATOLOGY_TESTS,
  biochemistryTests: DEFAULT_BIOCHEMISTRY_TESTS,
  fluidTests: DEFAULT_FLUID_TESTS,
  otherTests: DEFAULT_OTHER_TESTS,
  fluidAnalysis: DEFAULT_FLUID_ANALYSIS,
  cultureSamples: DEFAULT_CULTURE_SAMPLES,
  diagnosis: {
    score: 0,
    probability: 0,
    status: DiagnosisStatus.INCONCLUSIVE,
    reasoning: [],
  },
};
