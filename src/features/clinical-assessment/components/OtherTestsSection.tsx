import React from 'react';
import { usePatient } from '../../../store/PatientContext';
import { SectionCard } from '../../../components/common/SectionCard';
import { TestTable } from '../../../components/common/TestTable';

export const OtherTestsSection: React.FC = () => {
  const { clinical, setClinical } = usePatient();

  const updateResult = (index: number, value: string) => {
    setClinical((prev) => {
      const updated = [...prev.otherTests];
      updated[index] = { ...updated[index], result: value };
      return { ...prev, otherTests: updated };
    });
  };

  return (
    <SectionCard icon="labs" title="Xét nghiệm khác" numberBadge={3}>
      <TestTable tests={clinical.otherTests} onUpdateResult={updateResult} />
    </SectionCard>
  );
};
