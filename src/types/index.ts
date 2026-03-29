import { DiagnosisStatus, CultureStatus, ImageType } from '../lib/enums/status';

export interface Comorbidities {
  diabetes: boolean;
  smoking: boolean;
  immunosuppression: boolean;
  priorInfection: boolean;
  malnutrition: boolean;
  liverDisease: boolean;
}

export interface CharacteristicEntry {
  checked: boolean;
  note: string;
}

export interface RelatedCharacteristics {
  allergy: CharacteristicEntry;
  drugs: CharacteristicEntry;
  alcohol: CharacteristicEntry;
  smoking: CharacteristicEntry;
  other: CharacteristicEntry;
}

export interface SurgicalHistoryRow {
  id: string;
  surgeryDate: string;
  procedure: string;
  notes: string;
}

export interface PatientDemographics {
  id: string;
  name: string;
  mrn: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  height: number;
  weight: number;
  bmi: number;
  surgeryDate: string;
  symptomDate: string;
  isAcute: boolean;
  implantType: 'THA' | 'TKA';
  fixationType: string;
  implantNature: 'Primary' | 'Revision';
  comorbidities: Comorbidities;
  medicalHistory: string;
  pastMedicalHistory: string;
  relatedCharacteristics: RelatedCharacteristics;
  surgicalHistory: SurgicalHistoryRow[];
}

export interface CultureSample {
  sampleNumber: number;
  status: CultureStatus;
  bacteriaName: string;
}

export interface TestItem {
  id: string;
  name: string;
  result: string;
  normalRange: string;
  unit: string;
}

export interface DiagnosticImage {
  id: string;
  url: string;
  type: ImageType;
  name: string;
}

export interface ImagingData {
  description: string;
  images: DiagnosticImage[];
}

export interface Diagnosis {
  score: number;
  probability: number;
  status: DiagnosisStatus;
  reasoning: string[];
}

export interface ClinicalSymptoms {
  fever: boolean;
  sinusTract: boolean;
  pain: boolean;
  swelling: boolean;
  drainage: boolean;
}

export interface MajorCriteria {
  sinusTract: boolean;
  twoPositiveCultures: boolean;
}

export interface ClinicalAssessment {
  major: MajorCriteria;
  symptoms: ClinicalSymptoms;
  imaging: ImagingData;
  hematologyTests: TestItem[];
  biochemistryTests: TestItem[];
  fluidTests: TestItem[];
  otherTests: TestItem[];
  fluidAnalysis: TestItem[];
  cultureSamples: CultureSample[];
  diagnosis: Diagnosis;
}

export interface LabResult {
  day: string;
  wbc: number | null;
  neu: number | null;
  esr: number | null;
  crp: number | null;
}

export interface TreatmentPlan {
  pathogen: string;
  resistance: string;
  ivDrug: string;
  ivDosage: string;
  ivDuration: string;
  oralDrug: string;
  oralDosage: string;
  oralDuration: string;
  citation: string;
  confidence: number;
}
