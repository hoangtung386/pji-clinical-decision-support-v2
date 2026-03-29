import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type {
  PatientDemographics,
  ClinicalAssessment,
  LabResult,
  TreatmentPlan,
} from '../types/index';
import {
  DEFAULT_DEMOGRAPHICS,
  DEFAULT_CLINICAL,
  DEFAULT_LABS,
  DEFAULT_TREATMENT,
} from '../lib/constants/defaults';

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

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [demographics, setDemographics] = useState<PatientDemographics>(DEFAULT_DEMOGRAPHICS);
  const [clinical, setClinical] = useState<ClinicalAssessment>(DEFAULT_CLINICAL);
  const [labData, setLabData] = useState<LabResult[]>(DEFAULT_LABS);
  const [treatment, setTreatment] = useState<TreatmentPlan>(DEFAULT_TREATMENT);

  const updateLabData = (day: string, field: keyof LabResult, value: number) => {
    setLabData((prev) =>
      prev.map((item) => (item.day === day ? { ...item, [field]: value } : item)),
    );
  };

  return (
    <PatientContext.Provider
      value={{
        demographics,
        setDemographics,
        clinical,
        setClinical,
        labData,
        updateLabData,
        treatment,
        setTreatment,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
