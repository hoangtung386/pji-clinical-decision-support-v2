import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import { SectionCard } from '../../../components/common/SectionCard';

export const OnsetSection: React.FC = () => {
  const { demographics, setDemographics } = usePatient();

  return (
    <SectionCard icon="calendar_today" title="Ngày khởi phát bệnh" numberBadge={0}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700">Ngày khởi phát triệu chứng</span>
          <input
            type="date"
            value={demographics.symptomDate}
            onChange={(e) => setDemographics((prev) => ({ ...prev, symptomDate: e.target.value }))}
            className="w-full rounded-lg border-slate-300 h-11 px-3 border"
          />
          <span className="text-xs text-slate-500">
            Phân loại:{' '}
            <span className={`font-bold ${demographics.isAcute ? 'text-danger' : 'text-warning'}`}>
              {demographics.isAcute ? 'CẤP TÍNH (<3 tuần)' : 'MÃN TÍNH (>3 tuần)'}
            </span>
          </span>
        </label>
      </div>
    </SectionCard>
  );
};
