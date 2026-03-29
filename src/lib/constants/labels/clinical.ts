export const LAB_MARKERS = [
  { label: 'Bạch cầu (WBC)', key: 'wbc', unit: '10^9/L', alert: 10 },
  { label: 'Bạch cầu đa nhân (Neu%)', key: 'neu', unit: '%', alert: 75 },
  { label: 'ESR', key: 'esr', unit: 'mm/hr', alert: 30 },
  { label: 'CRP', key: 'crp', unit: 'mg/L', alert: 10 },
] as const;

export const SYMPTOMS_LIST = [
  { key: 'fever', label: 'Sốt' },
  { key: 'sinusTract', label: 'Đường rò' },
  { key: 'pain', label: 'Đau' },
  { key: 'swelling', label: 'Sưng nề' },
  { key: 'drainage', label: 'Chảy dịch' },
] as const;

export const CHARACTERISTICS_LIST = [
  { key: 'allergy', label: 'Dị ứng', code: '01', notePlaceholder: '(Dị nguyên)' },
  { key: 'drugs', label: 'Ma túy', code: '02', notePlaceholder: 'Nhập thời gian...' },
  { key: 'alcohol', label: 'Rượu bia', code: '03', notePlaceholder: 'Nhập thời gian...' },
  { key: 'smoking', label: 'Hút thuốc', code: '04', notePlaceholder: 'Nhập thời gian...' },
  { key: 'other', label: 'Khác', code: '05', notePlaceholder: 'Nhập thời gian...' },
] as const;

export const GRAM_STAIN_OPTIONS = ['Gram Dương', 'Gram Âm', 'Âm tính'] as const;

export const IMAGE_TYPE_OPTIONS = [
  { value: 'X-ray', label: 'X-quang' },
  { value: 'CT', label: 'CT' },
  { value: 'Ultrasound', label: 'Siêu âm' },
] as const;
