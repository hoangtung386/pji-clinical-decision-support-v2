import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import { CultureStatus } from '../../../lib/enums/status';

export const CultureSamplesInput: React.FC = () => {
  const { clinical, setClinical } = usePatient();

  const updateSample = (
    sampleIdx: number,
    updates: { status?: CultureStatus; bacteriaName?: string },
  ) => {
    setClinical((prev) => {
      const newSamples = [...prev.cultureSamples];
      newSamples[sampleIdx] = {
        ...newSamples[sampleIdx],
        ...updates,
        ...(updates.status === CultureStatus.NEGATIVE ? { bacteriaName: '' } : {}),
      };
      return { ...prev, cultureSamples: newSamples };
    });
  };

  return (
    <div className="p-2 space-y-2">
      {clinical.cultureSamples?.map((sample, sampleIdx) => (
        <div key={sample.sampleNumber} className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-600 w-14">Mẫu {sample.sampleNumber}:</span>
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name={`culture-${sampleIdx}`}
              checked={sample.status === CultureStatus.NEGATIVE}
              onChange={() => updateSample(sampleIdx, { status: CultureStatus.NEGATIVE })}
              className="w-3 h-3 accent-primary"
            />
            <span className="text-slate-700">Âm tính</span>
          </label>
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name={`culture-${sampleIdx}`}
              checked={sample.status === CultureStatus.POSITIVE}
              onChange={() => updateSample(sampleIdx, { status: CultureStatus.POSITIVE })}
              className="w-3 h-3 accent-primary"
            />
            <span className="text-slate-700">Dương tính</span>
          </label>
          {sample.status === CultureStatus.POSITIVE && (
            <input
              type="text"
              value={sample.bacteriaName}
              onChange={(e) => updateSample(sampleIdx, { bacteriaName: e.target.value })}
              placeholder="Tên vi khuẩn..."
              className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            />
          )}
        </div>
      ))}
    </div>
  );
};
