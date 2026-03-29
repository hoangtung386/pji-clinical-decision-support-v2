export const MENU_ITEMS = [
  { path: '/intake', label: 'Thông tin bệnh nhân', icon: 'person', step: 1 },
  { path: '/history', label: 'Tiền sử bệnh', icon: 'history', step: 2 },
  { path: '/clinical', label: 'Lâm sàng và cận lâm sàng', icon: 'clinical_notes', step: 3 },
  { path: '/labs', label: 'Kết quả xét nghiệm', icon: 'biotech', step: 4 },
  { path: '/treatment', label: 'Phác đồ điều trị', icon: 'medical_services', step: 5 },
] as const;
