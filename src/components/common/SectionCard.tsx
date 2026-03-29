import React from 'react';

interface SectionCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  numberBadge?: string | number;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  children,
  numberBadge,
}) => (
  <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
        {numberBadge !== undefined ? (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
            {numberBadge}
          </span>
        ) : (
          <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        )}
        {title}
      </h2>
    </div>
    {children}
  </section>
);
