import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import { SectionCard } from '../../../components/common/SectionCard';
import { TestTable } from '../../../components/common/TestTable';
import { TestSectionHeader } from '../../../components/common/TestSectionHeader';
import { TEST_SECTION_THEMES } from '../../../lib/constants/labels';
import { CultureSamplesInput } from './CultureSamplesInput';
import { GramStainInput } from './GramStainInput';
import type { TestItem } from '../../../types/index';

type TestCategory = 'hematologyTests' | 'biochemistryTests' | 'fluidTests';

export const PjiTestsSection: React.FC = () => {
  const { clinical, setClinical } = usePatient();

  const updateTestResult = (category: TestCategory, index: number, value: string) => {
    setClinical((prev) => {
      const updated = [...prev[category]];
      updated[index] = { ...updated[index], result: value };
      return { ...prev, [category]: updated };
    });
  };

  const updateFluidAnalysis = (index: number, value: string) => {
    setClinical((prev) => {
      const updated = [...(prev.fluidAnalysis || [])];
      updated[index] = { ...updated[index], result: value };
      return { ...prev, fluidAnalysis: updated };
    });
  };

  return (
    <SectionCard icon="science" title="Xét nghiệm chẩn đoán PJI" numberBadge={2}>
      {/* Hematology */}
      <div className="border-b border-slate-200">
        <TestSectionHeader number={1} title="Xét nghiệm huyết học" theme={TEST_SECTION_THEMES.hematology} />
        <TestTable
          tests={clinical.hematologyTests}
          onUpdateResult={(i, v) => updateTestResult('hematologyTests', i, v)}
        />
      </div>

      {/* Biochemistry */}
      <div className="border-b border-slate-200">
        <TestSectionHeader number={2} title="Xét nghiệm sinh hoá" theme={TEST_SECTION_THEMES.biochemistry} />
        <TestTable
          tests={clinical.biochemistryTests}
          onUpdateResult={(i, v) => updateTestResult('biochemistryTests', i, v)}
        />
      </div>

      {/* Fluid */}
      <div className="border-b border-slate-200">
        <TestSectionHeader number={3} title="Xét nghiệm dịch" theme={TEST_SECTION_THEMES.fluid} />
        <TestTable
          tests={clinical.fluidTests}
          onUpdateResult={(i, v) => updateTestResult('fluidTests', i, v)}
        />
      </div>

      {/* Culture & Gram Stain */}
      <div>
        <TestSectionHeader number={4} title="Cấy khuẩn & Nhuộm Gram" theme={TEST_SECTION_THEMES.culture} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 border-r border-slate-200">Tên xét nghiệm</th>
                <th className="px-4 py-3 border-r border-slate-200 w-32">Kết quả</th>
                <th className="px-4 py-3 border-r border-slate-200 w-32">Chỉ số BT</th>
                <th className="px-4 py-3">Đơn vị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {clinical.fluidAnalysis?.map((test, index) => (
                <tr key={test.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2 font-medium text-slate-900 border-r border-slate-200">
                    {test.name}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-200 p-0">
                    {test.name === 'Nhuộm Gram' ? (
                      <GramStainInput test={test} index={index} />
                    ) : test.name === 'Cấy khuẩn' ? (
                      <CultureSamplesInput />
                    ) : (
                      <input
                        type="text"
                        value={test.result}
                        onChange={(e) => updateFluidAnalysis(index, e.target.value)}
                        className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-inset focus:ring-2 focus:ring-primary outline-none"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-200 text-slate-700">
                    {test.normalRange}
                  </td>
                  <td className="px-4 py-2 text-slate-500 bg-slate-50/30">{test.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
};
