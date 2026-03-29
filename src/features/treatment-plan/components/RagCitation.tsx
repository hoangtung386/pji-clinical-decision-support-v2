import React from 'react';

interface RagCitationProps {
  citation: string;
}

export const RagCitation: React.FC<RagCitationProps> = ({ citation }) => (
  <div className="bg-slate-50 rounded-xl border border-slate-200 flex flex-col h-full">
    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-purple-600">smart_toy</span>
        <h3 className="font-bold text-slate-900 text-sm">Cơ sở bằng chứng (RAG)</h3>
      </div>
      <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
        Tạo bởi AI
      </span>
    </div>
    <div className="p-5 flex-1 space-y-4">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
          Trích dẫn hướng dẫn
        </p>
        <blockquote className="text-sm text-slate-700 italic border-l-2 border-primary pl-3 leading-relaxed">
          {citation}
        </blockquote>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-xs text-slate-400">menu_book</span>
          <a href="#" className="text-xs font-medium text-primary hover:underline">
            Hướng dẫn đồng thuận ICM 2018
          </a>
        </div>
      </div>
    </div>
  </div>
);
