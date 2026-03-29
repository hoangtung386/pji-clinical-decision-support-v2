import React from 'react';
import type { TreatmentPlan } from '../../../types/index';

interface TreatmentTimelineProps {
  treatment: TreatmentPlan;
}

export const TreatmentTimeline: React.FC<TreatmentTimelineProps> = ({ treatment }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
      <h3 className="text-lg font-bold text-slate-900">Liệu trình điều trị dự kiến</h3>
    </div>
    <div className="p-6 relative">
      <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-200 z-0" />

      {/* Phase 1: IV */}
      <div className="relative z-10 flex gap-6 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">
            1
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-500 uppercase">Tuần 1-2</div>
        </div>
        <div className="flex-1 bg-blue-50 border-l-4 border-primary rounded-r-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase">
              Điều trị tiêm tĩnh mạch
            </span>
            <h4 className="font-bold text-slate-900 text-lg">{treatment.ivDrug}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase font-semibold">Liều lượng</p>
              <p className="font-medium text-slate-800">{treatment.ivDosage}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-semibold">Thời gian</p>
              <p className="font-medium text-slate-800">{treatment.ivDuration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 2: Oral */}
      <div className="relative z-10 flex gap-6">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">
            2
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-500 uppercase">Tuần 3-6</div>
        </div>
        <div className="flex-1 bg-green-50 border-l-4 border-green-500 rounded-r-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">
              Điều trị uống duy trì
            </span>
            <h4 className="font-bold text-slate-900 text-lg">{treatment.oralDrug}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase font-semibold">Liều lượng</p>
              <p className="font-medium text-slate-800">{treatment.oralDosage}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-semibold">Thời gian</p>
              <p className="font-medium text-slate-800">{treatment.oralDuration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
