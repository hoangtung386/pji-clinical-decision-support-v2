import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePatient } from '../../store/PatientContext';
import { MENU_ITEMS } from '../../lib/constants/labels';
import { useAutoSave } from '../../hooks/useAutoSave';
import { clearToken, isAuthenticated } from '../../lib/utils/apiClient';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { demographics, clinical, labData, treatment } = usePatient();
  const location = useLocation();
  const navigate = useNavigate();
  const { saving, lastSaved, savePatient, saveClinical, saveLabs, saveTreatment } = useAutoSave();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const initials = demographics.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');

  const handleSaveAll = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    await savePatient(demographics);
    await saveClinical(clinical);
    await saveLabs(labData);
    await saveTreatment(treatment);
  };

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('user_info');
    localStorage.removeItem('current_patient_id');
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <aside className="flex w-72 flex-col justify-between border-r border-slate-200 bg-white flex-shrink-0 z-20 h-full">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[24px]">orthopedics</span>
            </div>
            <div>
              <h1 className="text-slate-900 text-lg font-bold leading-tight">OrthoSurg PJI</h1>
              <p className="text-slate-500 text-xs font-medium">Bộ chẩn đoán v2.4</p>
            </div>
          </div>

          {/* Current Case */}
          <div className="mx-4 mb-6 mt-2 rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Ca bệnh hiện tại
                </span>
                <h2 className="text-slate-900 text-sm font-bold">Ca số #{demographics.id}</h2>
                <p className="text-primary text-xs font-medium mt-1">Đang chẩn đoán</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-4">
            <p className="px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quy trình
            </p>
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: navActive }) =>
                  `group flex items-center gap-3 px-3 py-3 rounded-lg border-l-4 transition-all ${
                    navActive
                      ? 'bg-primary/10 text-primary border-primary'
                      : 'text-slate-600 hover:bg-slate-50 border-transparent'
                  }`
                }
              >
                <span
                  className={`material-symbols-outlined ${isActive(item.path) ? 'icon-filled' : ''}`}
                >
                  {item.icon}
                </span>
                <div className="flex flex-col">
                  <span className={`text-sm ${isActive(item.path) ? 'font-bold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                  <span className="text-xs opacity-80">Bước {item.step} / 5</span>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          {/* Save Status */}
          {saving && (
            <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
              Đang lưu...
            </div>
          )}
          {!saving && lastSaved && (
            <div className="flex items-center gap-2 text-xs text-green-600 px-2">
              <span className="material-symbols-outlined text-[14px]">cloud_done</span>
              Lưu lúc {lastSaved.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {saving ? 'Đang lưu...' : 'Lưu toàn bộ'}
          </button>

          {/* User Info & Logout */}
          {isAuthenticated() && userInfo.username && (
            <div className="flex items-center justify-between px-2 pt-2">
              <span className="text-xs text-slate-500 truncate">
                <span className="material-symbols-outlined text-[14px] align-middle">person</span>{' '}
                {userInfo.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Đăng xuất
              </button>
            </div>
          )}
          {!isAuthenticated() && (
            <button
              onClick={() => navigate('/login')}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Đăng nhập để lưu dữ liệu
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">{children}</main>
    </div>
  );
};
