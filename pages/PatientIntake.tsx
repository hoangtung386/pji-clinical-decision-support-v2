import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

export const PatientIntake: React.FC = () => {
  const navigate = useNavigate();
  const { demographics, setDemographics } = usePatient();

  // Logic: Calculate BMI
  const calculateBMI = (h: number, w: number) => {
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      return parseFloat((w / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return 0;
  };

  // Logic: Calculate Acute vs Chronic
  useEffect(() => {
    if (demographics.surgeryDate && demographics.symptomDate) {
      const surgery = new Date(demographics.surgeryDate);
      const onset = new Date(demographics.symptomDate);
      const diffTime = Math.abs(onset.getTime() - surgery.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // < 3 weeks (21 days) is Acute
      const isAcute = diffDays < 21;
      setDemographics(prev => ({ ...prev, isAcute, bmi: calculateBMI(prev.height, prev.weight) }));
    }
  }, [demographics.surgeryDate, demographics.symptomDate, demographics.height, demographics.weight, setDemographics]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setDemographics(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleRiskChange = (key: keyof typeof demographics.comorbidities) => {
    setDemographics(prev => ({
      ...prev,
      comorbidities: {
        ...prev.comorbidities,
        [key]: !prev.comorbidities[key]
      }
    }));
  };

  const handleSurgicalHistoryChange = (id: string, value: string) => {
    setDemographics(prev => ({
      ...prev,
      surgicalHistory: prev.surgicalHistory.map(row =>
        row.id === id ? { ...row, description: value } : row
      )
    }));
  };

  const addSurgicalHistoryRow = () => {
    setDemographics(prev => ({
      ...prev,
      surgicalHistory: [
        ...prev.surgicalHistory,
        { id: Date.now().toString(), description: '' }
      ]
    }));
  };


  const handleCharacteristicChange = (key: keyof typeof demographics.relatedCharacteristics, field: 'checked' | 'note', value: any) => {
    setDemographics(prev => ({
      ...prev,
      relatedCharacteristics: {
        ...prev.relatedCharacteristics,
        [key]: {
          ...prev.relatedCharacteristics[key],
          [field]: value
        }
      }
    }));
  };

  const characteristicsList = [
    { key: 'allergy', label: 'Dị ứng', code: '01', notePlaceholder: '(Dị nguyên)' },
    { key: 'drugs', label: 'Ma túy', code: '02' },
    { key: 'alcohol', label: 'Rượu bia', code: '03' },
    { key: 'smoking', label: 'Thuốc lá', code: '04' },
    { key: 'pipeTobacco', label: 'Thuốc lào', code: '05' },
    { key: 'other', label: 'Khác', code: '06' },
  ];

  const comorbidityLabels: Record<string, { label: string; detail: string }> = {
    diabetes: { label: 'Tiểu đường', detail: 'HbA1c > 7% hoặc không kiểm soát' },
    smoking: { label: 'Hút thuốc', detail: 'Hiện tại hoặc trong vòng 6 tháng qua' },
    immunosuppression: { label: 'Suy giảm miễn dịch', detail: 'Yếu tố đáng kể' },
    priorInfection: { label: 'Nhiễm trùng trước đó', detail: 'Yếu tố đáng kể' },
    malnutrition: { label: 'Suy dinh dưỡng', detail: 'Yếu tố đáng kể' },
    liverDisease: { label: 'Bệnh gan', detail: 'Yếu tố đáng kể' },
  };

  return (
    <>
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thông tin & Lịch sử Bệnh nhân</h1>
          <p className="text-slate-500 text-sm mt-1">Nhập thông tin định danh, tiền sử phẫu thuật và đánh giá nguy cơ ban đầu.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/4"></div>
          </div>
          <span className="text-xs font-semibold text-primary">Hoàn thành 25%</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 pb-32">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Identity Section */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                Định danh bệnh nhân
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Họ và tên</span>
                <input name="name" value={demographics.name} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 h-11 px-3 focus:ring-primary focus:border-primary border" placeholder="VD: Nguyễn Văn A" type="text" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Mã số bệnh nhân (MRN)</span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">#</span>
                  <input name="mrn" value={demographics.mrn} onChange={handleInputChange} className="w-full pl-8 rounded-lg border-slate-300 h-11 px-3 focus:ring-primary focus:border-primary border" placeholder="ID-123456" type="text" />
                </div>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Ngày sinh</span>
                <input name="dob" value={demographics.dob} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 h-11 px-3 focus:ring-primary focus:border-primary border" type="date" />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Số điện thoại</span>
                <input name="phone" value={demographics.phone} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 h-11 px-3 focus:ring-primary focus:border-primary border" placeholder="VD: 0912345678" type="tel" />
              </label>
              <label className="flex flex-col md:col-span-2 gap-1.5">
                <span className="text-sm font-medium text-slate-700">Địa chỉ</span>
                <input name="address" value={demographics.address} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 h-11 px-3 focus:ring-primary focus:border-primary border" placeholder="VD: Số 1, Đường ABC, Quận XYZ, TP.HCM" type="text" />
              </label>

              <div className="grid grid-cols-2 gap-4 col-span-2 md:col-span-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Chiều cao (cm)</span>
                  <input name="height" value={demographics.height} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 h-11 px-3 border" type="number" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Cân nặng (kg)</span>
                  <input name="weight" value={demographics.weight} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 h-11 px-3 border" type="number" />
                </label>
              </div>
              <div className="md:col-start-3 md:row-start-2 bg-primary/5 rounded-lg border border-primary/10 p-3 flex flex-col justify-center items-center">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Chỉ số BMI</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{demographics.bmi}</span>
                  <span className="text-xs text-slate-500">kg/m²</span>
                </div>
              </div>
            </div>
          </section>

          {/* Medical History Context */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                Hỏi bệnh
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 gap-6">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Quá trình bệnh lý</span>
                <textarea
                  name="medicalHistory"
                  value={demographics.medicalHistory}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 min-h-[120px] p-3 border focus:ring-primary focus:border-primary"
                  placeholder="Mô tả chi tiết quá trình bệnh lý..."
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Tiền sử bệnh</span>
                <textarea
                  name="pastMedicalHistory"
                  value={demographics.pastMedicalHistory}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 min-h-[120px] p-3 border focus:ring-primary focus:border-primary"
                  placeholder="Các bệnh lý nền, dị ứng, phẫu thuật trước đây..."
                />
              </label>

              {/* Related Characteristics Table */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">Đặc điểm liên quan bệnh:</span>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 text-center w-12 border-r border-slate-200">TT</th>
                        <th className="px-3 py-2 border-r border-slate-200">Ký hiệu</th>
                        <th className="px-3 py-2 w-16 text-center border-r border-slate-200">Chọn</th>
                        <th className="px-3 py-2">Thời gian (tính theo tháng) / Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {characteristicsList.map((item, index) => {
                        const config = demographics.relatedCharacteristics[item.key as keyof typeof demographics.relatedCharacteristics];
                        return (
                          <tr key={item.key} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 text-center text-slate-500 border-r border-slate-200">{item.code}</td>
                            <td className="px-3 py-2 font-medium text-slate-900 border-r border-slate-200">
                              - {item.label}
                            </td>
                            <td className="px-3 py-2 text-center border-r border-slate-200">
                              <input
                                type="checkbox"
                                checked={config.checked}
                                onChange={(e) => handleCharacteristicChange(item.key as any, 'checked', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 accent-primary"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={config.note}
                                onChange={(e) => handleCharacteristicChange(item.key as any, 'note', e.target.value)}
                                disabled={!config.checked}
                                className="w-full text-sm px-2 py-1 rounded border border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder={item.notePlaceholder || "Nhập thời gian..."}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Risk Factors */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">warning</span>
                Yếu tố nguy cơ & Cơ địa
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(demographics.comorbidities).map(([key, value]) => (
                <label key={key} className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" checked={value} onChange={() => handleRiskChange(key as any)} className="w-5 h-5 rounded border-slate-300 accent-primary mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 capitalize">
                      {comorbidityLabels[key]?.label || key}
                    </span>
                    <span className="text-xs text-slate-500">
                      {comorbidityLabels[key]?.detail}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Surgical History Table */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">surgical</span>
                Tiền sử phẫu thuật
              </h2>
            </div>
            <div className="p-6">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2 text-center w-16 border-r border-slate-200">STT</th>
                      <th className="px-3 py-2">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {demographics.surgicalHistory.map((row, index) => (
                      <tr key={row.id}>
                        <td className="px-3 py-2 text-center text-slate-500 border-r border-slate-200 bg-slate-50">{index}</td>
                        <td className="p-0">
                          <input
                            type="text"
                            value={row.description}
                            onChange={(e) => handleSurgicalHistoryChange(row.id, e.target.value)}
                            className="w-full px-3 py-2 border-none focus:ring-inset focus:ring-2 focus:ring-primary outline-none bg-transparent"
                            placeholder="Nhập thông tin phẫu thuật..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-center">
                <button onClick={addSurgicalHistoryRow} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Thêm hàng
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 p-4 px-8 flex items-center justify-between z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Hủy bỏ</button>
        <button onClick={() => navigate('/clinical')} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
          Lưu & Sang phần Lâm sàng
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </>
  );
};