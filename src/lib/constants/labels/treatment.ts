import { PathogenType } from '../../enums/status';

export const PATHOGEN_OPTIONS = [
  { value: PathogenType.MRSA, label: 'Tụ cầu vàng (MRSA)' },
  { value: PathogenType.MSSA, label: 'Tụ cầu vàng (MSSA)' },
  { value: PathogenType.CULTURE_NEGATIVE, label: 'Cấy âm tính' },
] as const;

export const RESISTANCE_OPTIONS = [
  { value: 'vancomycin', label: 'Kháng trung gian Vancomycin (VISA)' },
  { value: 'none', label: 'Nhạy cảm hoàn toàn' },
] as const;
