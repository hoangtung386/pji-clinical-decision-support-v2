import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import {
  DIAGNOSIS_STATUS_COLORS,
  DIAGNOSIS_STATUS_DETAIL_LABELS,
} from '../../../lib/constants/labels';

export const DiagnosisPanel: React.FC = () => {
  const { demographics, clinical } = usePatient();
  const { diagnosis } = clinical;
  const statusColor = DIAGNOSIS_STATUS_COLORS[diagnosis.status];

  return (
    <div className="sticky top-6 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" />
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-slate-900 font-bold text-lg">Công cụ chẩn đoán AI</h3>
              <p className="text-slate-500 text-xs">Dựa trên hướng dẫn ICM 2018</p>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
          </div>

          {/* Gauge */}
          <div className="flex flex-col items-center justify-center py-4 relative">
            <div className="relative h-48 w-48">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className={`${statusColor} transition-all duration-1000 ease-out`}
                  strokeDasharray={`${diagnosis.probability}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  {Math.round(diagnosis.probability)}%
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">
                  Xác suất
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-opacity-10 ${
                  diagnosis.status === 'Infected'
                    ? 'bg-red-500 border-red-200'
                    : 'bg-green-500 border-green-200'
                }`}
              >
                <span className={`text-sm font-bold ${statusColor}`}>
                  {DIAGNOSIS_STATUS_DETAIL_LABELS[diagnosis.status]}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                <span className="material-symbols-outlined text-[14px]">timelapse</span>
                {demographics.isAcute
                  ? 'Nhiễm trùng cấp tính (< 3 tuần)'
                  : 'Nhiễm trùng mãn tính (> 3 tuần)'}
              </div>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-base">psychology</span>
            Lập luận của AI
          </h4>
          <div className="space-y-4">
            {diagnosis.reasoning.map((text, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="mt-1 min-w-4 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
            {diagnosis.reasoning.length === 0 && (
              <p className="text-sm text-slate-400 italic">Chưa có tiêu chuẩn đáng kể nào.</p>
            )}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-200">
            <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              Xem tham chiếu Hướng dẫn ICM 2018
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
