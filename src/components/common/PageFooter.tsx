import React from 'react';

interface PageFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
}

export const PageFooter: React.FC<PageFooterProps> = ({
  onBack,
  onNext,
  backLabel = 'Quay lại',
  nextLabel = 'Tiếp tục',
}) => (
  <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 p-4 px-8 flex items-center justify-between z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
    {onBack ? (
      <button
        onClick={onBack}
        className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        {backLabel}
      </button>
    ) : (
      <button className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
        Hủy bỏ
      </button>
    )}
    {onNext && (
      <button
        onClick={onNext}
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
      >
        {nextLabel}
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    )}
  </div>
);
