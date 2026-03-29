import type { TreatmentPlan } from '../../../types/index';

export const DEFAULT_TREATMENT: TreatmentPlan = {
  pathogen: 'mrsa',
  resistance: 'vancomycin',
  ivDrug: 'Daptomycin',
  ivDosage: '6-8 mg/kg IV',
  ivDuration: '2 tuần',
  oralDrug: 'Rifampin + Ciprofloxacin',
  oralDosage: '600mg mỗi ngày / 750mg BID',
  oralDuration: '3-6 tuần',
  citation:
    '"Đối với PJI do MRSA khi MIC Vancomycin > 1.5 mcg/mL, Daptomycin được khuyến cáo là thuốc tiêm tĩnh mạch chính để tránh thất bại điều trị."',
  confidence: 94,
};
