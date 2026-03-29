import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import { PageHeader } from '../../../components/common/PageHeader';
import { LAB_MARKERS } from '../../../lib/constants/labels';
import { LabDataTable } from './LabDataTable';
import { LabChart } from './LabChart';

const CHART_COLORS: Record<string, string> = {
  wbc: '#136dec',
  neu: '#f59e0b',
  esr: '#ef4444',
  crp: '#ef4444',
};

export const LabAnalyticsPage: React.FC = () => {
  const { labData, updateLabData } = usePatient();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Phân tích chỉ số huyết thanh"
        breadcrumb={{ tag: 'Phác đồ PJI', label: 'Kết quả xét nghiệm' }}
      />

      <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
        <div className="max-w-[1600px] mx-auto w-full space-y-8">
          <LabDataTable labData={labData} onUpdate={updateLabData} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LAB_MARKERS.map((marker) => (
              <LabChart
                key={marker.key}
                title={marker.label}
                dataKey={marker.key}
                threshold={marker.alert}
                color={CHART_COLORS[marker.key]}
                unit={marker.unit}
                data={labData}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
