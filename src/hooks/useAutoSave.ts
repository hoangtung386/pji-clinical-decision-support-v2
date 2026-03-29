import { useCallback, useRef, useState } from 'react';
import { api, isAuthenticated } from '../lib/utils/apiClient';
import { showToast } from '../components/common/Toast';
import type {
  PatientDemographics,
  ClinicalAssessment,
  LabResult,
  TreatmentPlan,
} from '../types/index';

/** Get or set the current patient ID from localStorage */
export function getPatientId(): number | null {
  const id = localStorage.getItem('current_patient_id');
  return id ? parseInt(id, 10) : null;
}

export function setPatientId(id: number): void {
  localStorage.setItem('current_patient_id', String(id));
}

export function useAutoSave() {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const savePatient = useCallback(async (demographics: PatientDemographics) => {
    if (!isAuthenticated()) return;
    if (!demographics.mrn || !demographics.name || !demographics.dob) {
      showToast('Vui lòng nhập đủ: Họ tên, Ngày sinh trước khi lưu', 'info');
      return;
    }

    setSaving(true);
    try {
      const patientId = getPatientId();
      const payload: Record<string, unknown> = {
        name: demographics.name,
        gender: demographics.gender,
        height: demographics.height,
        weight: demographics.weight,
        implant_type: demographics.implantType,
        fixation_type: demographics.fixationType,
        implant_nature: demographics.implantNature,
        comorbidities: demographics.comorbidities,
        medical_history: demographics.medicalHistory || null,
        past_medical_history: demographics.pastMedicalHistory || null,
        related_characteristics: demographics.relatedCharacteristics,
        surgical_history: demographics.surgicalHistory.map((s) => ({
          surgery_date: s.surgeryDate,
          procedure: s.procedure,
          notes: s.notes,
        })),
      };
      // Only include date fields if they have values
      if (demographics.dob) payload.dob = demographics.dob;
      if (demographics.phone) payload.phone = demographics.phone;
      if (demographics.address) payload.address = demographics.address;
      if (demographics.surgeryDate) payload.surgery_date = demographics.surgeryDate;
      if (demographics.symptomDate) payload.symptom_date = demographics.symptomDate;

      if (patientId) {
        await api.put(`/patients/${patientId}`, payload);
      } else {
        const result = await api.post<{ id: number }>('/patients/', payload);
        setPatientId(result.id);
      }

      setLastSaved(new Date());
      showToast('Đã lưu thông tin bệnh nhân', 'success');
    } catch (err) {
      showToast('Lỗi khi lưu dữ liệu', 'error');
    } finally {
      setSaving(false);
    }
  }, []);

  const saveClinical = useCallback(async (clinical: ClinicalAssessment) => {
    if (!isAuthenticated()) return;
    const patientId = getPatientId();
    if (!patientId) return;

    setSaving(true);
    try {
      const payload = {
        major_criteria: {
          sinus_tract: clinical.major.sinusTract,
          two_positive_cultures: clinical.major.twoPositiveCultures,
        },
        symptoms: clinical.symptoms,
        imaging_description: clinical.imaging.description,
      };

      try {
        await api.get(`/patients/${patientId}/clinical/`);
        await api.put(`/patients/${patientId}/clinical/`, payload);
      } catch {
        await api.post(`/patients/${patientId}/clinical/`, {
          ...payload,
          culture_samples: clinical.cultureSamples.map((c) => ({
            sample_number: c.sampleNumber,
            status: c.status,
            bacteria_name: c.bacteriaName,
          })),
        });
      }

      setLastSaved(new Date());
      showToast('Đã lưu đánh giá lâm sàng', 'success');
    } catch {
      showToast('Lỗi khi lưu lâm sàng', 'error');
    } finally {
      setSaving(false);
    }
  }, []);

  const saveLabs = useCallback(async (labData: LabResult[]) => {
    if (!isAuthenticated()) return;
    const patientId = getPatientId();
    if (!patientId) return;

    setSaving(true);
    try {
      for (const lab of labData) {
        await api.post(`/patients/${patientId}/labs/`, {
          day: lab.day,
          wbc: lab.wbc,
          neu: lab.neu,
          esr: lab.esr,
          crp: lab.crp,
        });
      }
      setLastSaved(new Date());
      showToast('Đã lưu kết quả xét nghiệm', 'success');
    } catch {
      showToast('Lỗi khi lưu xét nghiệm', 'error');
    } finally {
      setSaving(false);
    }
  }, []);

  const saveTreatment = useCallback(async (treatment: TreatmentPlan) => {
    if (!isAuthenticated()) return;
    const patientId = getPatientId();
    if (!patientId) return;

    setSaving(true);
    try {
      const payload = {
        pathogen: treatment.pathogen,
        resistance: treatment.resistance,
        iv_drug: treatment.ivDrug,
        iv_dosage: treatment.ivDosage,
        iv_duration: treatment.ivDuration,
        oral_drug: treatment.oralDrug,
        oral_dosage: treatment.oralDosage,
        oral_duration: treatment.oralDuration,
        citation: treatment.citation,
        confidence: treatment.confidence,
      };

      try {
        await api.get(`/patients/${patientId}/treatment/`);
        await api.put(`/patients/${patientId}/treatment/`, payload);
      } catch {
        await api.post(`/patients/${patientId}/treatment/`, payload);
      }

      setLastSaved(new Date());
      showToast('Đã lưu phác đồ điều trị', 'success');
    } catch {
      showToast('Lỗi khi lưu phác đồ', 'error');
    } finally {
      setSaving(false);
    }
  }, []);

  const debouncedSave = useCallback(
    (fn: () => Promise<void>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(fn, 2000);
    },
    [],
  );

  return {
    saving,
    lastSaved,
    savePatient,
    saveClinical,
    saveLabs,
    saveTreatment,
    debouncedSave,
  };
}
