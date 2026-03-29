import { useCallback } from 'react';
import { api, isAuthenticated } from '../lib/utils/apiClient';
import { usePatient } from '../store/PatientContext';
import { showToast } from '../components/common/Toast';
import { setPatientId } from './useAutoSave';
import { DEFAULT_CLINICAL, DEFAULT_LABS, DEFAULT_TREATMENT } from '../lib/constants/defaults';
import { CultureStatus } from '../lib/enums/status';

/**
 * Hook to load full patient data (demographics + clinical + labs + treatment)
 * from backend into React context.
 */
export function useLoadPatient() {
  const { setDemographics, setClinical, setLabData, setTreatment, resetAll } = usePatient();

  const loadPatient = useCallback(
    async (patientId: number) => {
      if (!isAuthenticated()) return false;

      try {
        // Reset everything first
        resetAll();
        setPatientId(patientId);

        // Load demographics
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

        // Load clinical (may not exist)
        try {
          const c = await api.get<Record<string, unknown>>(`/patients/${patientId}/clinical/`);
          const symptoms = c.symptoms as Record<string, boolean> | undefined;
          const major = c.major_criteria as Record<string, boolean> | undefined;
          const cultures = c.culture_samples as {
            sample_number: number;
            status: string;
            bacteria_name: string | null;
          }[];

          setClinical((prev) => ({
            ...prev,
            symptoms: {
              fever: symptoms?.fever || false,
              sinusTract: symptoms?.sinus_tract || false,
              pain: symptoms?.pain || false,
              swelling: symptoms?.swelling || false,
              drainage: symptoms?.drainage || false,
            },
            major: {
              sinusTract: major?.sinus_tract || false,
              twoPositiveCultures: major?.two_positive_cultures || false,
            },
            imaging: {
              ...prev.imaging,
              description: (c.imaging_description as string) || '',
            },
            cultureSamples: Array.isArray(cultures)
              ? cultures.map((s) => ({
                  sampleNumber: s.sample_number,
                  status: s.status === 'positive' ? CultureStatus.POSITIVE : CultureStatus.NEGATIVE,
                  bacteriaName: s.bacteria_name || '',
                }))
              : prev.cultureSamples,
            diagnosis: {
              score: (c.diagnosis_score as number) || 0,
              probability: (c.diagnosis_probability as number) || 0,
              status: (c.diagnosis_status as typeof prev.diagnosis.status) || prev.diagnosis.status,
              reasoning: (c.diagnosis_reasoning as string[]) || [],
            },
          }));
        } catch {
          // No clinical data yet - keep defaults
        }

        // Load labs (may be empty)
        try {
          const labs = await api.get<
            { day: string; wbc: number | null; neu: number | null; esr: number | null; crp: number | null }[]
          >(`/patients/${patientId}/labs/`);

          if (labs.length > 0) {
            // Merge with default timeline slots
            const defaultDays = DEFAULT_LABS.map((l) => l.day);
            const merged = defaultDays.map((day) => {
              const found = labs.find((l) => l.day === day);
              return found || { day, wbc: null, neu: null, esr: null, crp: null };
            });
            setLabData(merged);
          }
        } catch {
          // No labs yet
        }

        // Load treatment (may not exist)
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
