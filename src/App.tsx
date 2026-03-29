import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PatientProvider } from './store/PatientContext';
import { PatientIntakePage } from './features/patient-intake';
import { MedicalHistoryPage } from './features/medical-history';
import { ClinicalAssessmentPage } from './features/clinical-assessment';
import { LabAnalyticsPage } from './features/lab-analytics';
import { TreatmentPlanPage } from './features/treatment-plan';

const App: React.FC = () => (
  <HashRouter>
    <PatientProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<PatientIntakePage />} />
          <Route path="/history" element={<MedicalHistoryPage />} />
          <Route path="/clinical" element={<ClinicalAssessmentPage />} />
          <Route path="/labs" element={<LabAnalyticsPage />} />
          <Route path="/treatment" element={<TreatmentPlanPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </PatientProvider>
  </HashRouter>
);

export default App;
