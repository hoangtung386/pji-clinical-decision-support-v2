import React from 'react';
import { LAB_MARKERS } from '../../../lib/constants/labels';
import type { LabResult } from '../../../types/index';

interface LabDataTableProps {
  labData: LabResult[];
  onUpdate: (day: string, field: keyof LabResult, value: number) => void;
}

export const LabDataTable: React.FC<LabDataTableProps> = ({ labData, onUpdate }) => (
  <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">table_chart</span>
        Nhập dữ liệu lâm sàng
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/5">
              Chỉ số
            </th>
            {labData.map((d) => (
              <th
                key={d.day}
                className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                {d.day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {LAB_MARKERS.map((marker) => (
            <tr key={marker.key} className="group hover:bg-slate-50 transition-colors">
              <td className="py-4 px-6">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">{marker.label}</span>
                  <span className="text-xs text-slate-500">{marker.unit}</span>
                </div>
              </td>
              {labData.map((d) => {
                const val = d[marker.key as keyof LabResult] as number;
                const isHigh = val > marker.alert;
                return (
                  <td key={d.day} className="px-4 py-3">
                    <div className="relative">
                      <input
                        type="number"
                        value={val || ''}
                        onChange={(e) =>
                          onUpdate(d.day, marker.key as keyof LabResult, parseFloat(e.target.value))
                        }
                        className={`w-full rounded p-2 text-sm font-mono border focus:ring-1 ${
                          isHigh
                            ? 'bg-red-50 border-red-200 text-red-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      />
                      {isHigh && (
                        <span className="material-symbols-outlined text-[16px] text-red-500 absolute right-3 top-1/2 -translate-y-1/2">
                          warning
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
