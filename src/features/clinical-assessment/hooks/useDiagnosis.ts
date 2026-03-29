import { useEffect } from 'react';
import { usePatient } from '../../../store/PatientContext';
import { isAcuteInfection } from '../../../lib/utils/dateUtils';
import { calculateDiagnosis } from '../../../lib/utils/icmScoring';

/**
 * Hook that auto-calculates acute/chronic status and diagnosis
 * whenever relevant clinical data changes.
 */
export function useDiagnosis() {
  const { demographics, setDemographics, clinical, setClinical } = usePatient();

  // Update acute/chronic classification
  useEffect(() => {
    if (!demographics.surgeryDate || !demographics.symptomDate) return;
    const acute = isAcuteInfection(demographics.surgeryDate, demographics.symptomDate);
    if (demographics.isAcute !== acute) {
      setDemographics((prev) => ({ ...prev, isAcute: acute }));
    }
  }, [demographics.surgeryDate, demographics.symptomDate, demographics.isAcute, setDemographics]);

  // Update diagnosis score
  useEffect(() => {
    const diagnosis = calculateDiagnosis(clinical);
    setClinical((prev) => ({ ...prev, diagnosis }));
  }, [clinical.symptoms, clinical.major, clinical.cultureSamples, setClinical]);
}
