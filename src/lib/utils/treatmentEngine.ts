import type { TreatmentPlan } from '../../types/index';
import { PathogenType } from '../enums/status';

interface TreatmentRecommendation {
  ivDrug: string;
  ivDosage: string;
  ivDuration: string;
  oralDrug: string;
  citation: string;
}

const TREATMENT_MAP: Record<string, TreatmentRecommendation> = {
  [PathogenType.MRSA]: {
    ivDrug: 'Daptomycin',
    ivDosage: '6-8 mg/kg IV',
    ivDuration: '2-4 tuần',
    oralDrug: 'Rifampin + Ciprofloxacin',
    citation:
      '"Đối với PJI do MRSA khi MIC Vancomycin > 1.5 mcg/mL, Daptomycin được khuyến cáo là thuốc tiêm tĩnh mạch chính để tránh thất bại điều trị. Phối hợp với Rifampin là rất quan trọng để thâm nhập màng sinh học trên dụng cụ còn lưu lại."',
  },
  [PathogenType.MSSA]: {
    ivDrug: 'Cefazolin',
    ivDosage: '2g IV mỗi 8 giờ',
    ivDuration: '2 tuần',
    oralDrug: 'Rifampin + Levofloxacin',
    citation:
      '"Đối với PJI do MSSA, Cefazolin hoặc Nafcillin là tiêu chuẩn vàng. Rifampin được thêm vào để tác động lên màng sinh học."',
  },
};

const DEFAULT_RECOMMENDATION: TreatmentRecommendation = {
  ivDrug: 'Vancomycin + Cefepime',
  ivDosage: 'Phác đồ phổ rộng',
  ivDuration: '4-6 tuần',
  oralDrug: 'Chờ kháng sinh đồ',
  citation:
    '"Đối với PJI cấy âm tính, cần bao phủ phổ rộng gồm MRSA và vi khuẩn Gram âm cho đến khi xác định được vi sinh vật."',
};

/**
 * Get treatment recommendation based on pathogen type.
 * Pure function - no side effects.
 */
export function getTreatmentRecommendation(
  pathogen: string,
): TreatmentRecommendation {
  return TREATMENT_MAP[pathogen] ?? DEFAULT_RECOMMENDATION;
}

/**
 * Apply recommendation to existing treatment plan.
 */
export function applyRecommendation(
  current: TreatmentPlan,
  pathogen: string,
): TreatmentPlan {
  const rec = getTreatmentRecommendation(pathogen);
  return {
    ...current,
    ivDrug: rec.ivDrug,
    ivDosage: rec.ivDosage,
    ivDuration: rec.ivDuration,
    oralDrug: rec.oralDrug,
    citation: rec.citation,
  };
}
