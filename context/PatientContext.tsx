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
  bloodTests: [
    { id: 'bt_1', name: 'Bạch cầu', result: '', normalRange: '', unit: 'Tế bào/Vi trường' },
    { id: 'bt_2', name: '%NEUT', result: '', normalRange: '40 - 74', unit: '%' },
    { id: 'bt_3', name: 'Máu lắng', result: '', normalRange: '< 10', unit: 'mm' },
    { id: 'bt_4', name: 'Định lượng CRP', result: '', normalRange: '0 - 5', unit: 'mg/l' },
    { id: 'bt_5', name: 'D-Dimer', result: '', normalRange: '< 0.5', unit: 'μg/mL' },
    { id: 'bt_6', name: 'Alpha Defensin', result: '', normalRange: '< 5.2', unit: 'μg/mL' },
    { id: 'bt_7', name: 'Leukocyte Esterase', result: '', normalRange: '< 200', unit: 'cells/μL' },
    { id: 'bt_8', name: 'Định lượng Glucose', result: '', normalRange: '4.1 - 5.6', unit: 'mmol/l' },
    { id: 'bt_9', name: 'Định lượng Urê máu', result: '', normalRange: '2.8 - 7.2', unit: 'mmol/l' },
    { id: 'bt_10', name: 'Định lượng Creatinin', result: '', normalRange: '59 - 104', unit: 'µmol/l' },
    { id: 'bt_16', name: 'Định lượng Albumin', result: '', normalRange: '35 - 52', unit: 'g/L' },
    { id: 'bt_11', name: 'Định lượng Protein toàn phần', result: '', normalRange: '66 - 83', unit: 'g/L' },
    { id: 'bt_17', name: 'Điện giải đồ (Na, K, Cl)', result: '', normalRange: '', unit: 'mmol/L' },
    { id: 'bt_12', name: 'Na+', result: '', normalRange: '135 - 145', unit: 'mmol/L' },
    { id: 'bt_13', name: 'K+', result: '', normalRange: '3.5 - 5.0', unit: 'mmol/L' },
    { id: 'bt_14', name: 'Cl-', result: '', normalRange: '', unit: 'mmol/L' },
    { id: 'bt_15', name: 'Định lượng Canxi toàn phần', result: '', normalRange: '2.2 - 2.65', unit: 'mmol/L' },
    { id: 'bt_18', name: 'Định lượng HbA1c', result: '', normalRange: '4 - 6.2', unit: '%' },
  ],
  fluidAnalysis: [
    { id: 'fa_1', name: 'Bạch cầu', result: '', normalRange: '', unit: '' },
    { id: 'fa_2', name: '%NEUT', result: '', normalRange: '', unit: '%' },
    { id: 'fa_3', name: 'CRP', result: '', normalRange: '', unit: '' },
    { id: 'fa_4', name: 'Cấy khuẩn', result: '', normalRange: '', unit: 'CFU/mL' },
    { id: 'fa_5', name: 'Nhuộm Gram', result: '', normalRange: '', unit: '' },
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