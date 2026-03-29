import { usePatient } from '../../../store/PatientContext';
import { generateId } from '../../../lib/utils/idGenerator';
import type { RelatedCharacteristics } from '../../../types/index';

export function useMedicalHistoryForm() {
  const { demographics, setDemographics } = usePatient();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setDemographics((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleCharacteristicChange = (
    key: keyof RelatedCharacteristics,
    field: 'checked' | 'note',
    value: boolean | string,
  ) => {
    setDemographics((prev) => ({
      ...prev,
      relatedCharacteristics: {
        ...prev.relatedCharacteristics,
        [key]: {
          ...prev.relatedCharacteristics[key],
          [field]: value,
        },
      },
    }));
  };

  const handleSurgicalHistoryChange = (
    id: string,
    field: 'surgeryDate' | 'procedure' | 'notes',
    value: string,
  ) => {
    setDemographics((prev) => ({
      ...prev,
      surgicalHistory: prev.surgicalHistory.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const addSurgicalHistoryRow = () => {
    setDemographics((prev) => ({
      ...prev,
      surgicalHistory: [
        ...prev.surgicalHistory,
        { id: generateId('sh'), surgeryDate: '', procedure: '', notes: '' },
      ],
    }));
  };

  const removeSurgicalHistoryRow = (index: number) => {
    setDemographics((prev) => ({
      ...prev,
      surgicalHistory: prev.surgicalHistory.filter((_, i) => i !== index),
    }));
  };

  const insertSurgicalHistoryRow = (index: number) => {
    setDemographics((prev) => {
      const newHistory = [...prev.surgicalHistory];
      newHistory.splice(index + 1, 0, {
        id: generateId('sh'),
        surgeryDate: '',
        procedure: '',
        notes: '',
      });
      return { ...prev, surgicalHistory: newHistory };
    });
  };

  return {
    demographics,
    handleInputChange,
    handleCharacteristicChange,
    handleSurgicalHistoryChange,
    addSurgicalHistoryRow,
    removeSurgicalHistoryRow,
    insertSurgicalHistoryRow,
  };
}
