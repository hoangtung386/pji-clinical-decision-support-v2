import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { PageFooter } from '../../../components/common/PageFooter';
import { SectionCard } from '../../../components/common/SectionCard';
import { usePatientForm } from '../hooks/usePatientForm';

export const PatientIntakePage: React.FC = () => {
  const navigate = useNavigate();
  const { demographics, handleInputChange } = usePatientForm();

  return (
    <>
      <PageHeader
        title="Thông tin bệnh nhân"
        subtitle="Nhập thông tin định danh bệnh nhân."
        progress={20}
      />

      <div className="flex-1 overflow-y-auto p-8 pb-32">
        <div className="max-w-5xl mx-auto space-y-6">
          <SectionCard icon="badge" title="Định danh bệnh nhân">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Họ và tên</span>
                <input
                  name="name"
                  value={demographics.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 h-11 px-3 focus:ring-primary focus:border-primary border"
                  placeholder="VD: Nguyễn Văn A"
                  type="text"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Mã số bệnh nhân (MRN)</span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    #
                  </span>
                  <input
                    name="mrn"
                    value={demographics.mrn}
                    readOnly
                    className="w-full pl-8 rounded-lg border-slate-300 h-11 px-3 border bg-slate-100 text-slate-600 cursor-not-allowed"
                    title="Mã bệnh nhân do hệ thống tự cấp"
                    type="text"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Ngày sinh</span>
                <input
                  name="dob"
                  value={demographics.dob}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 h-11 px-3 focus:ring-primary focus:border-primary border"
                  type="date"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Số điện thoại</span>
                <input
                  name="phone"
                  value={demographics.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 h-11 px-3 focus:ring-primary focus:border-primary border"
                  placeholder="VD: 0912345678"
                  type="tel"
                />
              </label>
              <label className="flex flex-col md:col-span-2 gap-1.5">
                <span className="text-sm font-medium text-slate-700">Địa chỉ</span>
                <input
                  name="address"
                  value={demographics.address}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 h-11 px-3 focus:ring-primary focus:border-primary border"
                  placeholder="VD: Số 1, Đường ABC, Quận XYZ, TP.HCM"
                  type="text"
                />
              </label>

              <div className="grid grid-cols-2 gap-4 col-span-2 md:col-span-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Chiều cao (cm)</span>
                  <input
                    name="height"
                    value={demographics.height}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-slate-300 h-11 px-3 border"
                    type="number"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Cân nặng (kg)</span>
                  <input
                    name="weight"
                    value={demographics.weight}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-slate-300 h-11 px-3 border"
                    type="number"
                  />
                </label>
              </div>
              <div className="md:col-start-3 md:row-start-2 bg-primary/5 rounded-lg border border-primary/10 p-3 flex flex-col justify-center items-center">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Chỉ số BMI
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{demographics.bmi}</span>
                  <span className="text-xs text-slate-500">kg/m²</span>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <PageFooter onNext={() => navigate('/history')} />
    </>
  );
};
