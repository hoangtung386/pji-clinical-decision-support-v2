import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import { SectionCard } from '../../../components/common/SectionCard';
import { SYMPTOMS_LIST } from '../../../lib/constants/labels';
import type { ClinicalSymptoms } from '../../../types/index';

export const SymptomsSection: React.FC = () => {
  const { clinical, setClinical } = usePatient();

  const toggleSymptom = (key: string) => {
    setClinical((prev) => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [key]: !prev.symptoms[key as keyof ClinicalSymptoms],
      },
    }));
  };

  return (
    <SectionCard icon="symptoms" title="Triệu chứng" numberBadge={1}>
      <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SYMPTOMS_LIST.map((item) => (
          <label
            key={item.key}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={clinical.symptoms?.[item.key as keyof ClinicalSymptoms] || false}
              onChange={() => toggleSymptom(item.key)}
              className="w-5 h-5 rounded border-slate-300 accent-primary"
            />
            <span className="text-sm font-medium text-slate-700">{item.label}</span>
          </label>
        ))}
      </div>
    </SectionCard>
  );
};
