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

};

return (
  <>
    <header className="flex-shrink-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thông tin bệnh nhân</h1>
        <p className="text-slate-500 text-sm mt-1">Nhập thông tin định danh bệnh nhân.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/4"></div>
        </div>
        <span className="text-xs font-semibold text-primary">Hoàn thành 20%</span>
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

      </div>
    </div>

    {/* Footer */}
    <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 p-4 px-8 flex items-center justify-between z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <button className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Hủy bỏ</button>
      <button onClick={() => navigate('/history')} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
        Tiếp tục
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>
  </>
);
};