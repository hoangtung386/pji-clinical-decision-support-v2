import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import { useTreatmentEffect } from '../hooks/useTreatmentEffect';
import { ClinicalInputs } from './ClinicalInputs';
import { TreatmentTimeline } from './TreatmentTimeline';
import { RagCitation } from './RagCitation';

export const TreatmentPlanPage: React.FC = () => {
  const { treatment } = usePatient();

  useTreatmentEffect();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Khuyến nghị phác đồ kháng sinh</h1>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">
          Độ tin cậy AI: {treatment.confidence}%
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-6">
          <ClinicalInputs />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TreatmentTimeline treatment={treatment} />
            </div>
            <div className="lg:col-span-1">
              <RagCitation citation={treatment.citation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
