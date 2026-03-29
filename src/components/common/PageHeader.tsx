import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  progress?: number;
  breadcrumb?: { tag: string; label: string };
  rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  progress,
  breadcrumb,
  rightContent,
}) => (
  <header className="flex-shrink-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-10">
    <div>
      {breadcrumb && (
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
            {breadcrumb.tag}
          </span>
          <span className="text-slate-400 text-sm">/</span>
          <span className="text-slate-500 text-sm font-medium">{breadcrumb.label}</span>
        </div>
      )}
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-3">
      {progress !== undefined && (
        <>
          <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-semibold text-primary">Hoàn thành {progress}%</span>
        </>
      )}
      {rightContent}
    </div>
  </header>
);
