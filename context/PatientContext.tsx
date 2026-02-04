import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PatientDemographics, ClinicalAssessment, LabResult, TreatmentPlan } from '../types';

interface PatientContextType {
  demographics: PatientDemographics;
  setDemographics: React.Dispatch<React.SetStateAction<PatientDemographics>>;
  clinical: ClinicalAssessment;
  setClinical: React.Dispatch<React.SetStateAction<ClinicalAssessment>>;
  labData: LabResult[];
  updateLabData: (day: string, field: keyof LabResult, value: number) => void;
  treatment: TreatmentPlan;
  setTreatment: React.Dispatch<React.SetStateAction<TreatmentPlan>>;
}

const defaultDemographics: PatientDemographics = {
  id: '1293',
  name: 'Nguyễn Văn A',
  mrn: '482910',
  dob: '1965-10-12',
  gender: 'male',
  phone: '',
  address: '',
  height: 175,
  weight: 70,
  bmi: 22.9,
  surgeryDate: '2023-01-15',
  symptomDate: '2023-10-20',
  isAcute: false,
  implantType: 'TKA',
  fixationType: 'cemented',
  implantNature: 'Primary',
  comorbidities: {
    diabetes: false,
    smoking: false,
    immunosuppression: false,
    priorInfection: false,
    malnutrition: false,
    liverDisease: false,
  },
  medicalHistory: '',
  pastMedicalHistory: '',
  relatedCharacteristics: {
    allergy: { checked: false, note: '' },
    drugs: { checked: false, note: '' },
    alcohol: { checked: false, note: '' },
    smoking: { checked: false, note: '' },
    other: { checked: false, note: '' },
  },
  surgicalHistory: [
    { id: '1', surgeryDate: '', procedure: '', notes: '' }
  ],
};

const defaultClinical: ClinicalAssessment = {
  major: { sinusTract: false, twoPositiveCultures: false },
  symptoms: {
    fever: false,
    sinusTract: false,
    erythema: false,
    pain: false,
    swelling: false,
    drainage: false,
    purulence: false,
  },
  imaging: {
    description: '',
    images: []
  },
  synovial: { wbc: 3200, pmn: 82, alphaDefensin: 'Trace', leukocyteEsterase: '1+' },
  bloodTests: [
    { id: 'bt_1', name: 'Bạch cầu', result: '', normalRange: '', unit: 'Tế bào/Vi thường' },
    { id: 'bt_2', name: '%NEUT', result: '', normalRange: '', unit: '%' },
    { id: 'bt_3', name: 'Máu lắng', result: '', normalRange: '', unit: 'mm' },
    { id: 'bt_4', name: 'Định lượng CRP', result: '', normalRange: '', unit: 'mg/l' },
    { id: 'bt_5', name: 'D-Dimer', result: '', normalRange: '', unit: 'μg/mL' },
    { id: 'bt_6', name: 'Alpha Defensin', result: '', normalRange: '', unit: 'μg/mL' },
    { id: 'bt_7', name: 'Leukocyte Esterase', result: '', normalRange: '', unit: 'cells/μL' },
  ],
  diagnosis: { score: 0, probability: 0, status: 'Inconclusive', reasoning: [] },
};

const defaultLabs: LabResult[] = [
  { day: 'Trước mổ', wbc: 6.5, neu: 55, esr: 12, crp: 4.0 },
  { day: 'Ngày 1', wbc: 12.1, neu: 82, esr: 45, crp: 145 },
  { day: 'Ngày 3', wbc: 9.8, neu: 65, esr: 38, crp: 85 },
  { day: 'Ngày 7', wbc: null, neu: null, esr: null, crp: null },
];

const defaultTreatment: TreatmentPlan = {
  pathogen: 'mrsa',
  resistance: 'vancomycin',
  ivDrug: 'Daptomycin',
  ivDosage: '6-8 mg/kg IV',
  ivDuration: '2 tuần',
  oralDrug: 'Rifampin + Ciprofloxacin',
  oralDosage: '600mg mỗi ngày / 750mg BID',
  oralDuration: '3-6 tuần',
  citation: '"Đối với PJI do MRSA khi MIC Vancomycin > 1.5 mcg/mL, Daptomycin được khuyến cáo là thuốc tiêm tĩnh mạch chính để tránh thất bại điều trị."',
  confidence: 94,
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [demographics, setDemographics] = useState<PatientDemographics>(defaultDemographics);
  const [clinical, setClinical] = useState<ClinicalAssessment>(defaultClinical);
  const [labData, setLabData] = useState<LabResult[]>(defaultLabs);
  const [treatment, setTreatment] = useState<TreatmentPlan>(defaultTreatment);

  const updateLabData = (day: string, field: keyof LabResult, value: number) => {
    setLabData(prev => prev.map(item => item.day === day ? { ...item, [field]: value } : item));
  };

  return (
    <PatientContext.Provider value={{
      demographics, setDemographics,
      clinical, setClinical,
      labData, updateLabData,
      treatment, setTreatment
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) throw new Error("usePatient must be used within a PatientProvider");
  return context;
};