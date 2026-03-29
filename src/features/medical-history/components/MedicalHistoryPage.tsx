import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { PageFooter } from '../../../components/common/PageFooter';
import { SectionCard } from '../../../components/common/SectionCard';
import { CharacteristicsTable } from './CharacteristicsTable';
import { SurgicalHistoryTable } from './SurgicalHistoryTable';
import { useMedicalHistoryForm } from '../hooks/useMedicalHistoryForm';

export const MedicalHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    demographics,
    handleInputChange,
    handleCharacteristicChange,
    handleSurgicalHistoryChange,
    addSurgicalHistoryRow,
    removeSurgicalHistoryRow,
    insertSurgicalHistoryRow,
  } = useMedicalHistoryForm();

  return (
    <>
      <PageHeader
        title="Tiền sử bệnh"
        subtitle="Ghi nhận tiền sử bệnh và tiền sử phẫu thuật."
        progress={40}
      />

      <div className="flex-1 overflow-y-auto p-8 pb-32">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Medical History Context */}
          <SectionCard icon="history" title="Hỏi bệnh">
            <div className="p-6 grid grid-cols-1 gap-6">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Quá trình bệnh lý</span>
                <textarea
                  name="medicalHistory"
                  value={demographics.medicalHistory}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 min-h-[120px] p-3 border focus:ring-primary focus:border-primary"
                  placeholder="Mô tả chi tiết quá trình bệnh lý..."
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Tiền sử bệnh</span>
                <textarea
                  name="pastMedicalHistory"
                  value={demographics.pastMedicalHistory}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 min-h-[120px] p-3 border focus:ring-primary focus:border-primary"
                  placeholder="Các bệnh lý nền, dị ứng, phẫu thuật trước đây..."
                />
              </label>

              <CharacteristicsTable
                characteristics={demographics.relatedCharacteristics}
                onChange={handleCharacteristicChange}
              />
            </div>
          </SectionCard>

          {/* Surgical History */}
          <SectionCard icon="surgical" title="Tiền sử phẫu thuật">
            <SurgicalHistoryTable
              rows={demographics.surgicalHistory}
              onChange={handleSurgicalHistoryChange}
              onInsert={insertSurgicalHistoryRow}
              onRemove={removeSurgicalHistoryRow}
              onAdd={addSurgicalHistoryRow}
            />
          </SectionCard>
        </div>
      </div>

      <PageFooter onBack={() => navigate('/')} onNext={() => navigate('/clinical')} />
    </>
  );
};
