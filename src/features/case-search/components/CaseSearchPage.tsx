import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, isAuthenticated } from '../../../lib/utils/apiClient';
import { showToast } from '../../../components/common/Toast';
import { usePatient } from '../../../store/PatientContext';
import { setPatientId } from '../../../hooks/useAutoSave';

interface PatientSearchResult {
  id: number;
  mrn: string;
  name: string;
  dob: string;
  gender: string;
  implant_type: string;
  is_acute: boolean;
  created_at: string;
}

interface NextMrnResponse {
  next_mrn: string;
}

export const CaseSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { setDemographics, resetAll } = usePatient();
  const [mrn, setMrn] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<PatientSearchResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [nextMrn, setNextMrn] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!mrn.trim()) {
      showToast('Vui lòng nhập mã bệnh nhân', 'error');
      return;
    }

    if (!isAuthenticated()) {
      showToast('Vui lòng đăng nhập trước', 'error');
      navigate('/login');
      return;
    }

    setLoading(true);
    setSearchResult(null);
    setNotFound(false);
    setNextMrn(null);

    try {
      const patient = await api.get<PatientSearchResult>(`/patients/search/${mrn.trim()}`);
      setSearchResult(patient);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCase = async () => {
    if (!searchResult) return;

    // Load full patient data from backend
    try {
      const full = await api.get<Record<string, unknown>>(`/patients/${searchResult.id}`);
      setPatientId(searchResult.id);
      localStorage.setItem('current_mrn', searchResult.mrn);
      setDemographics((prev) => ({
        ...prev,
        id: String(searchResult.id),
        mrn: searchResult.mrn,
        name: (full.name as string) || '',
        dob: (full.dob as string) || '',
        gender: (full.gender as string) || 'male',
        phone: (full.phone as string) || '',
        address: (full.address as string) || '',
        height: (full.height as number) || 0,
        weight: (full.weight as number) || 0,
        bmi: (full.bmi as number) || 0,
        surgeryDate: (full.surgery_date as string) || '',
        symptomDate: (full.symptom_date as string) || '',
        isAcute: (full.is_acute as boolean) || false,
        implantType: (full.implant_type as 'THA' | 'TKA') || 'TKA',
        fixationType: (full.fixation_type as string) || 'cemented',
        implantNature: (full.implant_nature as 'Primary' | 'Revision') || 'Primary',
        medicalHistory: (full.medical_history as string) || '',
        pastMedicalHistory: (full.past_medical_history as string) || '',
      }));
      showToast(`Đã mở ca bệnh #${searchResult.mrn} - ${searchResult.name}`, 'success');
      navigate('/intake');
    } catch {
      showToast('Lỗi khi tải dữ liệu bệnh nhân', 'error');
    }
  };

  const handleCreateNew = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Get next MRN from backend
      const res = await api.get<NextMrnResponse>('/patients/next-mrn/');
      const newMrn = res.next_mrn;

      // Create patient in DB immediately with this MRN
      const patient = await api.post<PatientSearchResult>('/patients/', {
        mrn: newMrn,
        name: '(Chưa nhập)',
        dob: '2000-01-01',
        gender: 'male',
      });

      // Reset ALL context data (clinical, labs, treatment) to clean state
      resetAll();

      // Then set only the new patient info
      setPatientId(patient.id);
      localStorage.setItem('current_mrn', newMrn);
      setDemographics((prev) => ({
        ...prev,
        id: String(patient.id),
        mrn: newMrn,
      }));

      showToast(`Tạo ca bệnh mới - Mã BN: ${newMrn}`, 'success');
      navigate('/intake');
    } catch {
      showToast('Lỗi khi tạo ca bệnh mới', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-[40px]">orthopedics</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">OrthoSurg PJI Advisor</h1>
          <p className="text-slate-500 mt-2">Hệ thống hỗ trợ quyết định lâm sàng</p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Tra cứu ca bệnh</h2>
            <p className="text-sm text-slate-500 mb-6">Nhập mã bệnh nhân để mở hồ sơ hoặc tạo ca bệnh mới</p>

            {/* Search Input */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={mrn}
                  onChange={(e) => {
                    setMrn(e.target.value);
                    setSearchResult(null);
                    setNotFound(false);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập mã bệnh nhân (VD: 0, 1, 2...)"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                  autoFocus
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="h-12 px-6 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">search</span>
                )}
                Tìm
              </button>
            </div>
          </div>

          {/* Search Result: Found */}
          {searchResult && (
            <div className="border-t border-slate-100 bg-green-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                <span className="text-green-800 font-bold">Tìm thấy bệnh nhân</span>
              </div>
              <div className="bg-white rounded-xl border border-green-200 p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">Mã BN:</span>
                    <span className="ml-2 font-bold text-slate-900">#{searchResult.mrn}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Họ tên:</span>
                    <span className="ml-2 font-bold text-slate-900">{searchResult.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Ngày sinh:</span>
                    <span className="ml-2 text-slate-700">{searchResult.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Giới tính:</span>
                    <span className="ml-2 text-slate-700">
                      {searchResult.gender === 'male' ? 'Nam' : 'Nữ'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Vị trí:</span>
                    <span className="ml-2 text-slate-700">{searchResult.implant_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Phân loại:</span>
                    <span className={`ml-2 font-bold ${searchResult.is_acute ? 'text-red-600' : 'text-amber-600'}`}>
                      {searchResult.is_acute ? 'Cấp tính' : 'Mãn tính'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleOpenCase}
                className="w-full h-12 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">folder_open</span>
                Mở ca bệnh
              </button>
            </div>
          )}

          {/* Search Result: Not Found */}
          {notFound && (
            <div className="border-t border-slate-100 bg-amber-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-amber-600">info</span>
                <span className="text-amber-800 font-bold">
                  Không tìm thấy mã bệnh nhân "{mrn}"
                </span>
              </div>
              <button
                onClick={handleCreateNew}
                disabled={loading}
                className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Tạo ca bệnh mới
              </button>
              <p className="text-xs text-amber-700 text-center mt-3">
                Mã bệnh nhân sẽ được hệ thống tự động cấp
              </p>
            </div>
          )}
        </div>

        {/* Quick Create */}
        <div className="mt-6 text-center">
          <button
            onClick={handleCreateNew}
            disabled={loading}
            className="text-sm text-primary font-medium hover:underline flex items-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Tạo ca bệnh mới ngay (không cần tìm kiếm)
          </button>
        </div>

        {/* Login hint */}
        {!isAuthenticated() && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-slate-500 hover:text-primary flex items-center gap-1 mx-auto"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              Đăng nhập để sử dụng hệ thống
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
