import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { demographics } = usePatient();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Thông tin bệnh nhân', icon: 'person', step: 1 },
    { path: '/history', label: 'Tiền sử bệnh', icon: 'history', step: 2 },
    { path: '/clinical', label: 'Dấu hiệu lâm sàng', icon: 'clinical_notes', step: 3 },
    { path: '/labs', label: 'Kết quả xét nghiệm', icon: 'biotech', step: 4 },
    { path: '/treatment', label: 'Phác đồ điều trị', icon: 'medical_services', step: 5 },
  ];

  // Helper to check if a route is active (or if it's the root path)
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar */}
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
                {demographics.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Ca bệnh hiện tại</span>
                <h2 className="text-slate-900 text-sm font-bold">Ca số #{demographics.id}</h2>
                <p className="text-primary text-xs font-medium mt-1">Đang chẩn đoán</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-4">
            <p className="px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quy trình</p>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `group flex items-center gap-3 px-3 py-3 rounded-lg border-l-4 transition-all ${isActive
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'text-slate-600 hover:bg-slate-50 border-transparent'
                  }`}
              >
                <span className={`material-symbols-outlined ${isActive(item.path) ? 'icon-filled' : ''}`}>
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

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Lưu nháp
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};