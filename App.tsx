import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PatientProvider } from './context/PatientContext';
import { PatientIntake } from './pages/PatientIntake';
import { MedicalHistoryPage } from './pages/MedicalHistory';
import { ClinicalAssessmentPage } from './pages/ClinicalAssessment';
import { LabAnalytics } from './pages/LabAnalytics';
import { TreatmentPlanPage } from './pages/TreatmentPlan';

const App: React.FC = () => {
  return (
    <HashRouter>
      <PatientProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<PatientIntake />} />
            <Route path="/history" element={<MedicalHistoryPage />} />
            <Route path="/clinical" element={<ClinicalAssessmentPage />} />
            <Route path="/labs" element={<LabAnalytics />} />
            <Route path="/treatment" element={<TreatmentPlanPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </PatientProvider>
    </HashRouter>
  );
};

export default App;
