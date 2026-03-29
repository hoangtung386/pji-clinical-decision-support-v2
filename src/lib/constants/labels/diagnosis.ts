import { DiagnosisStatus } from '../../enums/status';

export const DIAGNOSIS_STATUS_LABELS: Record<DiagnosisStatus, string> = {
  [DiagnosisStatus.INFECTED]: 'Nhiễm trùng',
  [DiagnosisStatus.INCONCLUSIVE]: 'Chưa xác định',
  [DiagnosisStatus.NOT_INFECTED]: 'Không nhiễm trùng',
};

export const DIAGNOSIS_STATUS_DETAIL_LABELS: Record<DiagnosisStatus, string> = {
  [DiagnosisStatus.INFECTED]: 'Nguy cơ cao PJI',
  [DiagnosisStatus.INCONCLUSIVE]: 'Chưa xác định',
  [DiagnosisStatus.NOT_INFECTED]: 'Không nhiễm trùng',
};

export const DIAGNOSIS_STATUS_COLORS: Record<DiagnosisStatus, string> = {
  [DiagnosisStatus.INFECTED]: 'text-danger',
  [DiagnosisStatus.INCONCLUSIVE]: 'text-warning',
  [DiagnosisStatus.NOT_INFECTED]: 'text-success',
};
