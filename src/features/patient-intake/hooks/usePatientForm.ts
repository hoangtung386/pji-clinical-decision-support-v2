import { useEffect } from 'react';
import { usePatient } from '../../../store/PatientContext';
import { calculateBmi } from '../../../lib/utils/bmiCalculator';
import { isAcuteInfection } from '../../../lib/utils/dateUtils';

export function usePatientForm() {
  const { demographics, setDemographics } = usePatient();

  useEffect(() => {
    if (!demographics.surgeryDate || !demographics.symptomDate) return;

    const isAcute = isAcuteInfection(demographics.surgeryDate, demographics.symptomDate);
    const bmi = calculateBmi(demographics.height, demographics.weight);

    setDemographics((prev) => ({ ...prev, isAcute, bmi }));
  }, [
    demographics.surgeryDate,
    demographics.symptomDate,
    demographics.height,
    demographics.weight,
    setDemographics,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setDemographics((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  return { demographics, handleInputChange };
}
