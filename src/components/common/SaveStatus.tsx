import React from 'react';

interface SaveStatusProps {
  saving: boolean;
  lastSaved: Date | null;
  onSave: () => void;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ saving, lastSaved, onSave }) => {
  const timeStr = lastSaved
    ? lastSaved.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="flex items-center gap-3">
      {saving && (
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
          Đang lưu...
        </span>
      )}
      {!saving && lastSaved && (
        <span className="flex items-center gap-1 text-xs text-green-600">
          <span className="material-symbols-outlined text-[14px]">cloud_done</span>
          Đã lưu lúc {timeStr}
        </span>
      )}
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[16px]">save</span>
        Lưu
      </button>
    </div>
  );
};
