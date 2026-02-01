import React, { useEffect } from 'react';
import { usePatient } from '../context/PatientContext';

export const TreatmentPlanPage: React.FC = () => {
  const { treatment, setTreatment } = usePatient();

  // Mock RAG Logic based on inputs
  useEffect(() => {
    if (treatment.pathogen === 'mrsa') {
      setTreatment(prev => ({
        ...prev,
        ivDrug: 'Daptomycin',
        ivDosage: '6-8 mg/kg IV',
        ivDuration: '2-4 tuần',
        oralDrug: 'Rifampin + Ciprofloxacin',
        citation: '"Đối với PJI do MRSA khi MIC Vancomycin > 1.5 mcg/mL, Daptomycin được khuyến cáo là thuốc tiêm tĩnh mạch chính để tránh thất bại điều trị. Phối hợp với Rifampin là rất quan trọng để thâm nhập màng sinh học trên dụng cụ còn lưu lại."'
      }));
    } else if (treatment.pathogen === 'mssa') {
      setTreatment(prev => ({
        ...prev,
        ivDrug: 'Cefazolin',
        ivDosage: '2g IV mỗi 8 giờ',
        ivDuration: '2 tuần',
        oralDrug: 'Rifampin + Levofloxacin',
        citation: '"Đối với PJI do MSSA, Cefazolin hoặc Nafcillin là tiêu chuẩn vàng. Rifampin được thêm vào để tác động lên màng sinh học."'
      }));
    } else {
       setTreatment(prev => ({
        ...prev,
        ivDrug: 'Vancomycin + Cefepime',
        ivDosage: 'Phác đồ phổ rộng',
        ivDuration: '4-6 tuần',
        oralDrug: 'Chờ kháng sinh đồ',
        citation: '"Đối với PJI cấy âm tính, cần bao phủ phổ rộng gồm MRSA và vi khuẩn Gram âm cho đến khi xác định được vi sinh vật."'
      }));
    }
  }, [treatment.pathogen, setTreatment]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Khuyến nghị phác đồ kháng sinh</h1>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">Độ tin cậy AI: {treatment.confidence}%</div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Inputs */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">biotech</span>
              <h3 className="text-lg font-bold text-slate-900">Đầu vào lâm sàng & Hồ sơ kháng thuốc</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Tác nhân gây bệnh được xác định</label>
                <select 
                  value={treatment.pathogen} 
                  onChange={(e) => setTreatment(p => ({...p, pathogen: e.target.value}))}
                  className="w-full rounded-lg border-slate-200 bg-slate-50 h-12 px-4 border"
                >
                  <option value="mrsa">Tụ cầu vàng (MRSA)</option>
                  <option value="mssa">Tụ cầu vàng (MSSA)</option>
                  <option value="culture_negative">Cấy âm tính</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Hồ sơ kháng thuốc</label>
                 <select 
                  value={treatment.resistance} 
                  onChange={(e) => setTreatment(p => ({...p, resistance: e.target.value}))}
                  className="w-full rounded-lg border-slate-200 bg-slate-50 h-12 px-4 border"
                >
                  <option value="vancomycin">Kháng trung gian Vancomycin (VISA)</option>
                  <option value="none">Nhạy cảm hoàn toàn</option>
                </select>
                <div className="flex items-center gap-1.5 text-warning text-xs mt-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span>Cảnh báo: Bệnh nhân có tiền sử dị ứng Penicillin.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline & RAG */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-900">Liệu trình điều trị dự kiến</h3>
                </div>
                <div className="p-6 relative">
                  <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-200 z-0"></div>
                  
                  {/* Phase 1 */}
                  <div className="relative z-10 flex gap-6 mb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">1</div>
                      <div className="mt-2 text-xs font-semibold text-slate-500 uppercase">Tuần 1-2</div>
                    </div>
                    <div className="flex-1 bg-blue-50 border-l-4 border-primary rounded-r-lg p-5">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase">Điều trị tiêm tĩnh mạch</span>
                         <h4 className="font-bold text-slate-900 text-lg">{treatment.ivDrug}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 text-xs uppercase font-semibold">Liều lượng</p>
                          <p className="font-medium text-slate-800">{treatment.ivDosage}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase font-semibold">Thời gian</p>
                          <p className="font-medium text-slate-800">{treatment.ivDuration}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="relative z-10 flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">2</div>
                      <div className="mt-2 text-xs font-semibold text-slate-500 uppercase">Tuần 3-6</div>
                    </div>
                    <div className="flex-1 bg-green-50 border-l-4 border-green-500 rounded-r-lg p-5">
                       <div className="flex items-center gap-2 mb-2">
                         <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">Điều trị uống duy trì</span>
                         <h4 className="font-bold text-slate-900 text-lg">{treatment.oralDrug}</h4>
                      </div>
                       <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 text-xs uppercase font-semibold">Liều lượng</p>
                          <p className="font-medium text-slate-800">{treatment.oralDosage}</p>
                        </div>
                         <div>
                          <p className="text-slate-500 text-xs uppercase font-semibold">Thời gian</p>
                          <p className="font-medium text-slate-800">{treatment.oralDuration}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* RAG Citation */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-xl border border-slate-200 flex flex-col h-full">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600">smart_toy</span>
                    <h3 className="font-bold text-slate-900 text-sm">Cơ sở bằng chứng (RAG)</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Tạo bởi AI</span>
                </div>
                <div className="p-5 flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Trích dẫn hướng dẫn</p>
                    <blockquote className="text-sm text-slate-700 italic border-l-2 border-primary pl-3 leading-relaxed">
                      {treatment.citation}
                    </blockquote>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-slate-400">menu_book</span>
                      <a href="#" className="text-xs font-medium text-primary hover:underline">Hướng dẫn đồng thuận ICM 2018</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};