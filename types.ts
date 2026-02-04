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
}

export interface ClinicalAssessment {
  major: {
    sinusTract: boolean;
    twoPositiveCultures: boolean;
  };
  minor: {
    erythema: boolean;
    swelling: boolean;
    warmth: boolean;
    fever: boolean;
    drainage: boolean;
    painVas: number;
  };
  synovial: {
    wbc: number;
    pmn: number;
    alphaDefensin: 'Positive' | 'Negative' | 'Trace';
    leukocyteEsterase: 'Negative' | '1+' | '2+' | '3+';
  };
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
