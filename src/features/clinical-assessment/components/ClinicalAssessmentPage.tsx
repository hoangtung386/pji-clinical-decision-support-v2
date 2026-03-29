import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../../store/PatientContext';
import { useDiagnosis } from '../hooks/useDiagnosis';
import { OnsetSection } from './OnsetSection';
import { SymptomsSection } from './SymptomsSection';
import { PjiTestsSection } from './PjiTestsSection';
import { OtherTestsSection } from './OtherTestsSection';
import { ImagingSection } from './ImagingSection';
import { DiagnosisPanel } from './DiagnosisPanel';

export const ClinicalAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { demographics } = usePatient();

  useDiagnosis();

  return (
    <>
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-10">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {demographics.name}
            </h2>
            <span className="text-slate-400 text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">
              ID #{demographics.mrn}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Ngày sinh: {demographics.dob}
            <span className="text-slate-300 mx-1">|</span>
            <span className="material-symbols-outlined text-sm">accessibility_new</span>
            Vị trí: {demographics.implantType} ({demographics.implantNature})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/labs')}
            className="flex items-center justify-center gap-2 px-5 h-10 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-lg shadow-md transition-all"
          >
            Tạo báo cáo
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 pb-20">
              <OnsetSection />
              <SymptomsSection />
              <PjiTestsSection />
              <OtherTestsSection />
              <ImagingSection />
            </div>

            {/* Right Column: AI Diagnosis */}
            <div className="lg:col-span-5 xl:col-span-4 h-full relative">
              <DiagnosisPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
