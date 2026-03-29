import type { PatientDemographics } from '../../../types/index';

const todayStr = () => new Date().toISOString().split('T')[0];

export const DEFAULT_DEMOGRAPHICS: PatientDemographics = {
  id: '1293',
  name: 'Nguyễn Văn A',
  mrn: '482910',
  dob: '1965-10-12',
  gender: 'male',
  phone: '',
  address: '',
  height: 175,
  weight: 70,
  bmi: 22.9,
  surgeryDate: todayStr(),
  symptomDate: todayStr(),
  isAcute: false,
  implantType: 'TKA',
  fixationType: 'cemented',
  implantNature: 'Primary',
  comorbidities: {
    diabetes: false,
    smoking: false,
    immunosuppression: false,
    priorInfection: false,
    malnutrition: false,
    liverDisease: false,
  },
  medicalHistory: '',
  pastMedicalHistory: '',
  relatedCharacteristics: {
    allergy: { checked: false, note: '' },
    drugs: { checked: false, note: '' },
    alcohol: { checked: false, note: '' },
    smoking: { checked: false, note: '' },
    other: { checked: false, note: '' },
  },
  surgicalHistory: [{ id: '1', surgeryDate: '', procedure: '', notes: '' }],
};
