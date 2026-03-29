import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import { PATHOGEN_OPTIONS, RESISTANCE_OPTIONS } from '../../../lib/constants/labels';

export const ClinicalInputs: React.FC = () => {
  const { treatment, setTreatment } = usePatient();

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">biotech</span>
        <h3 className="text-lg font-bold text-slate-900">
          Đầu vào lâm sàng & Hồ sơ kháng thuốc
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Tác nhân gây bệnh được xác định
          </label>
          <select
            value={treatment.pathogen}
            onChange={(e) => setTreatment((p) => ({ ...p, pathogen: e.target.value }))}
            className="w-full rounded-lg border-slate-200 bg-slate-50 h-12 px-4 border"
          >
            {PATHOGEN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Hồ sơ kháng thuốc</label>
          <select
            value={treatment.resistance}
            onChange={(e) => setTreatment((p) => ({ ...p, resistance: e.target.value }))}
            className="w-full rounded-lg border-slate-200 bg-slate-50 h-12 px-4 border"
          >
            {RESISTANCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1.5 text-warning text-xs mt-1">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>Cảnh báo: Bệnh nhân có tiền sử dị ứng Penicillin.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
