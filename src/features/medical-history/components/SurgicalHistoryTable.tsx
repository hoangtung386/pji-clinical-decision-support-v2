import React from 'react';
import type { SurgicalHistoryRow } from '../../../types/index';

interface SurgicalHistoryTableProps {
  rows: SurgicalHistoryRow[];
  onChange: (id: string, field: 'surgeryDate' | 'procedure' | 'notes', value: string) => void;
  onInsert: (index: number) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export const SurgicalHistoryTable: React.FC<SurgicalHistoryTableProps> = ({
  rows,
  onChange,
  onInsert,
  onRemove,
  onAdd,
}) => (
  <div className="p-6">
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="px-3 py-2 text-center w-16 border-r border-slate-200">Lần PT</th>
            <th className="px-3 py-2 w-32 border-r border-slate-200">Thời gian</th>
            <th className="px-3 py-2 border-r border-slate-200">Phương pháp phẫu thuật</th>
            <th className="px-3 py-2 border-r border-slate-200">Ghi chú</th>
            <th className="px-3 py-2 text-center w-24" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row, index) => (
            <tr key={row.id} className="group hover:bg-slate-50/50">
              <td className="px-3 py-2 text-center text-slate-500 border-r border-slate-200 bg-slate-50">
                {index + 1}
              </td>
              <td className="p-0 border-r border-slate-200">
                <input
                  type="text"
                  value={row.surgeryDate}
                  onChange={(e) => onChange(row.id, 'surgeryDate', e.target.value)}
                  className="w-full px-3 py-2 border-none focus:ring-inset focus:ring-2 focus:ring-primary outline-none bg-transparent"
                  placeholder="dd/mm/yyyy"
                />
              </td>
              <td className="p-0 border-r border-slate-200">
                <input
                  type="text"
                  value={row.procedure}
                  onChange={(e) => onChange(row.id, 'procedure', e.target.value)}
                  className="w-full px-3 py-2 border-none focus:ring-inset focus:ring-2 focus:ring-primary outline-none bg-transparent"
                  placeholder="Nhập phương pháp..."
                />
              </td>
              <td className="p-0 border-r border-slate-200">
                <input
                  type="text"
                  value={row.notes}
                  onChange={(e) => onChange(row.id, 'notes', e.target.value)}
                  className="w-full px-3 py-2 border-none focus:ring-inset focus:ring-2 focus:ring-primary outline-none bg-transparent"
                  placeholder="Ghi chú thêm..."
                />
              </td>
              <td className="px-3 py-2 flex items-center justify-center gap-1 opacity-100 transition-opacity">
                <button
                  onClick={() => onInsert(index)}
                  className="p-1 rounded hover:bg-blue-100 text-blue-600 transition-colors"
                  title="Chèn hàng dưới"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button
                  onClick={() => onRemove(index)}
                  className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                  title="Xóa hàng"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-3 flex justify-center">
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        Thêm hàng
      </button>
    </div>
  </div>
);
