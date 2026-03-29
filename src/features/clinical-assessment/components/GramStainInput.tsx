import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import { GRAM_STAIN_OPTIONS } from '../../../lib/constants/labels';
import type { TestItem } from '../../../types/index';

interface GramStainInputProps {
  test: TestItem;
  index: number;
}

export const GramStainInput: React.FC<GramStainInputProps> = ({ test, index }) => {
  const { clinical, setClinical } = usePatient();

  const handleToggle = (opt: string, checked: boolean) => {
    const current = test.result ? test.result.split(', ').filter(Boolean) : [];
    const newResult = checked
      ? [...current, opt].join(', ')
      : current.filter((x) => x !== opt).join(', ');

    setClinical((prev) => {
      const updated = [...(prev.fluidAnalysis || [])];
      updated[index] = { ...updated[index], result: newResult };
      return { ...prev, fluidAnalysis: updated };
    });
  };

  return (
    <div className="flex flex-wrap gap-1 p-2">
      {GRAM_STAIN_OPTIONS.map((opt) => (
        <label
          key={opt}
          className="inline-flex items-center gap-1 cursor-pointer bg-slate-100 px-2 py-1 rounded border border-slate-200 hover:bg-white transition-colors"
        >
          <input
            type="checkbox"
            checked={test.result.includes(opt)}
            onChange={(e) => handleToggle(opt, e.target.checked)}
            className="w-3 h-3 accent-primary rounded-sm"
          />
          <span className="text-xs font-medium">{opt}</span>
        </label>
      ))}
    </div>
  );
};
