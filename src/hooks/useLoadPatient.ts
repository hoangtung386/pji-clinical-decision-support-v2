import { useCallback } from 'react';
import { api, isAuthenticated } from '../lib/utils/apiClient';
import { usePatient } from '../store/PatientContext';
import { showToast } from '../components/common/Toast';
import { setPatientId } from './useAutoSave';
import { DEFAULT_LABS, DEFAULT_TREATMENT } from '../lib/constants/defaults';
import { CultureStatus } from '../lib/enums/status';
import type { TestItem, CultureSample } from '../types/index';

interface BackendTestResult {
  id: number;
  category: string;
  name: string;
  result: string | null;
  normal_range: string | null;
  unit: string | null;
}

interface BackendCultureSample {
  id: number;
  sample_number: number;
  status: string;
  bacteria_name: string | null;
}

interface BackendClinical {
  id: number;
  patient_id: number;
  major_criteria: Record<string, boolean>;
  symptoms: Record<string, boolean>;
  imaging_description: string | null;
  diagnosis_score: number;
  diagnosis_probability: number;
  diagnosis_status: string;
  diagnosis_reasoning: string[];
  test_results: BackendTestResult[];
  culture_samples: BackendCultureSample[];
}

interface BackendLab {
  id: number;
  day: string;
  wbc: number | null;
  neu: number | null;
  esr: number | null;
  crp: number | null;
}

function mapTestResults(
  backendTests: BackendTestResult[],
  category: string,
  fallback: TestItem[],
): TestItem[] {
  const filtered = backendTests.filter((t) => t.category === category);
  if (filtered.length === 0) return fallback;

  return filtered.map((t, i) => ({
    id: `${category}_${i}`,
    name: t.name,
    result: t.result || '',
    normalRange: t.normal_range || '',
    unit: t.unit || '',
  }));
}

function mapCultureSamples(
  backendSamples: BackendCultureSample[],
  fallback: CultureSample[],
): CultureSample[] {
  if (backendSamples.length === 0) return fallback;

  return backendSamples.map((s) => ({
    sampleNumber: s.sample_number,
    status: s.status === 'positive' ? CultureStatus.POSITIVE : CultureStatus.NEGATIVE,
    bacteriaName: s.bacteria_name || '',
  }));
}

export function useLoadPatient() {
  const { setDemographics, setClinical, setLabData, setTreatment, resetAll } = usePatient();

  const loadPatient = useCallback(
    async (patientId: number) => {
      if (!isAuthenticated()) return false;

      try {
        resetAll();
        setPatientId(patientId);

        // 1. Load demographics
        const p = await api.get<Record<string, unknown>>(`/patients/${patientId}`);
        setDemographics((prev) => ({
          ...prev,
          id: String(patientId),
          mrn: (p.mrn as string) || '',
          name: (p.name as string) || '',
          dob: (p.dob as string) || '',
          gender: (p.gender as string) || 'male',
          phone: (p.phone as string) || '',
          address: (p.address as string) || '',
          height: (p.height as number) || 0,
          weight: (p.weight as number) || 0,
          bmi: (p.bmi as number) || 0,
          surgeryDate: (p.surgery_date as string) || '',
          symptomDate: (p.symptom_date as string) || '',
          isAcute: (p.is_acute as boolean) || false,
          implantType: (p.implant_type as 'THA' | 'TKA') || 'TKA',
          fixationType: (p.fixation_type as string) || 'cemented',
          implantNature: (p.implant_nature as 'Primary' | 'Revision') || 'Primary',
          medicalHistory: (p.medical_history as string) || '',
          pastMedicalHistory: (p.past_medical_history as string) || '',
          comorbidities: (p.comorbidities as typeof prev.comorbidities) || prev.comorbidities,
          relatedCharacteristics:
            (p.related_characteristics as typeof prev.relatedCharacteristics) ||
            prev.relatedCharacteristics,
          surgicalHistory: Array.isArray(p.surgical_history)
            ? (p.surgical_history as { surgery_date?: string; procedure?: string; notes?: string }[]).map(
                (s, i) => ({
                  id: String(i),
                  surgeryDate: s.surgery_date || '',
                  procedure: s.procedure || '',
                  notes: s.notes || '',
                }),
              )
            : prev.surgicalHistory,
        }));

        // 2. Load clinical + test results + cultures + diagnosis
        try {
          const c = await api.get<BackendClinical>(`/patients/${patientId}/clinical/`);

          setClinical((prev) => ({
            ...prev,
            symptoms: {
              fever: c.symptoms?.fever || false,
              sinusTract: c.symptoms?.sinus_tract || false,
              pain: c.symptoms?.pain || false,
              swelling: c.symptoms?.swelling || false,
              drainage: c.symptoms?.drainage || false,
            },
            major: {
              sinusTract: c.major_criteria?.sinus_tract || false,
              twoPositiveCultures: c.major_criteria?.two_positive_cultures || false,
            },
            imaging: {
              ...prev.imaging,
              description: c.imaging_description || '',
            },
            // Load test results by category
            hematologyTests: mapTestResults(c.test_results, 'hematology', prev.hematologyTests),
            biochemistryTests: mapTestResults(c.test_results, 'biochemistry', prev.biochemistryTests),
            fluidTests: mapTestResults(c.test_results, 'fluid', prev.fluidTests),
            otherTests: mapTestResults(c.test_results, 'other', prev.otherTests),
            fluidAnalysis: mapTestResults(c.test_results, 'fluid_analysis', prev.fluidAnalysis),
            // Load culture samples
            cultureSamples: mapCultureSamples(c.culture_samples, prev.cultureSamples),
            // Load diagnosis
            diagnosis: {
              score: c.diagnosis_score || 0,
              probability: c.diagnosis_probability || 0,
              status: (c.diagnosis_status as typeof prev.diagnosis.status) || prev.diagnosis.status,
              reasoning: c.diagnosis_reasoning || [],
            },
          }));
        } catch {
          // No clinical data yet
        }

        // 3. Load labs
        try {
          const labs = await api.get<BackendLab[]>(`/patients/${patientId}/labs/`);
          if (labs.length > 0) {
            const defaultDays = DEFAULT_LABS.map((l) => l.day);
            const merged = defaultDays.map((day) => {
              const found = labs.find((l) => l.day === day);
              return found
                ? { day, wbc: found.wbc, neu: found.neu, esr: found.esr, crp: found.crp }
                : { day, wbc: null, neu: null, esr: null, crp: null };
            });
            setLabData(merged);
          }
        } catch {
          // No labs yet
        }

        // 4. Load treatment
        try {
          const t = await api.get<Record<string, unknown>>(`/patients/${patientId}/treatment/`);
          setTreatment({
            pathogen: (t.pathogen as string) || DEFAULT_TREATMENT.pathogen,
            resistance: (t.resistance as string) || '',
            ivDrug: (t.iv_drug as string) || '',
            ivDosage: (t.iv_dosage as string) || '',
            ivDuration: (t.iv_duration as string) || '',
            oralDrug: (t.oral_drug as string) || '',
            oralDosage: (t.oral_dosage as string) || '',
            oralDuration: (t.oral_duration as string) || '',
            citation: (t.citation as string) || '',
            confidence: (t.confidence as number) || 0,
          });
        } catch {
          // No treatment yet
        }

        return true;
      } catch {
        showToast('Lỗi khi tải dữ liệu bệnh nhân', 'error');
        return false;
      }
    },
    [resetAll, setDemographics, setClinical, setLabData, setTreatment],
  );

  return { loadPatient };
}
