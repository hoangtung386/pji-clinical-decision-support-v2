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
  comorbidities: {
    diabetes: boolean;
    smoking: boolean;
    immunosuppression: boolean;
    priorInfection: boolean;
    malnutrition: boolean;
    liverDisease: boolean;
  };
  medicalHistory: string;
  pastMedicalHistory: string;
  relatedCharacteristics: {
    allergy: { checked: boolean; note: string };
    drugs: { checked: boolean; note: string };
    alcohol: { checked: boolean; note: string };
    smoking: { checked: boolean; note: string };
    other: { checked: boolean; note: string };
  };
  surgicalHistory: {
    id: string;
    surgeryDate: string;
    procedure: string;
    notes: string;
  }[];
}

export interface CultureSample {
  sampleNumber: number;
  status: 'negative' | 'positive';
  bacteriaName: string;
}

export interface TestItem {
  id: string;
  name: string;
  result: string;
  normalRange: string;
  unit: string;
}

export interface ClinicalAssessment {
  major: {
    sinusTract: boolean;
    twoPositiveCultures: boolean;
  };
  symptoms: {
    fever: boolean;
    sinusTract: boolean;
    pain: boolean;
    swelling: boolean;
    drainage: boolean;
  };
  imaging: {
    description: string;
    images: {
      id: string;
      url: string;
      type: 'X-ray' | 'CT' | 'Ultrasound';
      name: string;
    }[];
  };
  hematologyTests: TestItem[];
  biochemistryTests: TestItem[];
  fluidTests: TestItem[];
  otherTests: TestItem[];
  fluidAnalysis: TestItem[];  // For Cấy khuẩn and Nhuộm Gram only
  cultureSamples: CultureSample[];
  diagnosis: {
    score: number;
    probability: number;
    status: 'Infected' | 'Inconclusive' | 'Not Infected';
    reasoning: string[];
  };
}

export interface LabResult {
  day: string; // 'Pre-Op' | 'Day 1' | 'Day 3' | 'Day 7'
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
