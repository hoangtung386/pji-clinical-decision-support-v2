import { useEffect, useRef } from 'react';
import { usePatient } from '../../../store/PatientContext';
import { applyRecommendation } from '../../../lib/utils/treatmentEngine';

/**
 * Applies treatment recommendation when pathogen changes.
 * Uses ref to prevent infinite loop.
 */
export function useTreatmentEffect() {
  const { treatment, setTreatment } = usePatient();
  const prevPathogen = useRef(treatment.pathogen);

  useEffect(() => {
    if (prevPathogen.current !== treatment.pathogen) {
      prevPathogen.current = treatment.pathogen;
      setTreatment((prev) => applyRecommendation(prev, prev.pathogen));
    }
  }, [treatment.pathogen, setTreatment]);
}
