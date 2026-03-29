import { useCallback, useState } from 'react';
import { api, isAuthenticated } from '../lib/utils/apiClient';
import { showToast } from '../components/common/Toast';
import type {
  PatientDemographics,
  ClinicalAssessment,
  LabResult,
  TreatmentPlan,
} from '../types/index';

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

  const savePatient = useCallback(async (demographics: PatientDemographics) => {
    if (!isAuthenticated()) return;
    const patientId = getPatientId();
    if (!patientId) return;

    if (!demographics.name || demographics.name === '(Chưa nhập)') {
      showToast('Vui lòng nhập Họ tên trước khi lưu', 'info');
      return;
    }

    setSaving(true);
    try {
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
      if (demographics.dob) payload.dob = demographics.dob;
      if (demographics.phone) payload.phone = demographics.phone;
      if (demographics.address) payload.address = demographics.address;
      if (demographics.surgeryDate) payload.surgery_date = demographics.surgeryDate;
      if (demographics.symptomDate) payload.symptom_date = demographics.symptomDate;

      await api.put(`/patients/${patientId}`, payload);
      setLastSaved(new Date());
      showToast('Đã lưu thông tin bệnh nhân', 'success');
    } catch {
      showToast('Lỗi khi lưu thông tin bệnh nhân', 'error');
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
        imaging_description: clinical.imaging.description || null,
      };

      // Check if clinical exists, then PUT or POST
      let exists = false;
      try {
        await api.get(`/patients/${patientId}/clinical/`);
        exists = true;
      } catch {
        exists = false;
      }

      if (exists) {
        await api.put(`/patients/${patientId}/clinical/`, payload);
      } else {
        await api.post(`/patients/${patientId}/clinical/`, {
          ...payload,
          culture_samples: clinical.cultureSamples.map((c) => ({
            sample_number: c.sampleNumber,
            status: c.status,
            bacteria_name: c.bacteriaName || null,
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

    // Skip if all labs are empty
    const hasData = labData.some(
      (l) => l.wbc !== null || l.neu !== null || l.esr !== null || l.crp !== null,
    );
    if (!hasData) return;

    setSaving(true);
    try {
      // Delete existing labs first, then create new ones
      const existing = await api.get<{ id: number }[]>(`/patients/${patientId}/labs/`);
      for (const lab of existing) {
        await api.delete(`/patients/${patientId}/labs/${lab.id}`);
      }

      // Create only labs that have data
      for (const lab of labData) {
        if (lab.wbc !== null || lab.neu !== null || lab.esr !== null || lab.crp !== null) {
          await api.post(`/patients/${patientId}/labs/`, {
            day: lab.day,
            wbc: lab.wbc,
            neu: lab.neu,
            esr: lab.esr,
            crp: lab.crp,
          });
        }
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

    // Skip if no pathogen selected
    if (!treatment.pathogen) return;

    setSaving(true);
    try {
      const payload = {
        pathogen: treatment.pathogen,
        resistance: treatment.resistance || null,
        iv_drug: treatment.ivDrug || null,
        iv_dosage: treatment.ivDosage || null,
        iv_duration: treatment.ivDuration || null,
        oral_drug: treatment.oralDrug || null,
        oral_dosage: treatment.oralDosage || null,
        oral_duration: treatment.oralDuration || null,
        citation: treatment.citation || null,
        confidence: treatment.confidence,
      };

      let exists = false;
      try {
        await api.get(`/patients/${patientId}/treatment/`);
        exists = true;
      } catch {
        exists = false;
      }

      if (exists) {
        await api.put(`/patients/${patientId}/treatment/`, payload);
      } else {
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

  return { saving, lastSaved, savePatient, saveClinical, saveLabs, saveTreatment };
}
