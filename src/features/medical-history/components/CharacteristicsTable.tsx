import React from 'react';
import { CHARACTERISTICS_LIST } from '../../../lib/constants/labels';
import type { RelatedCharacteristics } from '../../../types/index';

interface CharacteristicsTableProps {
  characteristics: RelatedCharacteristics;
  onChange: (
    key: keyof RelatedCharacteristics,
    field: 'checked' | 'note',
    value: boolean | string,
  ) => void;
}

export const CharacteristicsTable: React.FC<CharacteristicsTableProps> = ({
  characteristics,
  onChange,
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-sm font-medium text-slate-700">Đặc điểm liên quan bệnh:</span>
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="px-3 py-2 text-center w-12 border-r border-slate-200">TT</th>
            <th className="px-3 py-2 border-r border-slate-200">Ký hiệu</th>
            <th className="px-3 py-2 w-16 text-center border-r border-slate-200">Chọn</th>
            <th className="px-3 py-2">Thời gian (tính theo tháng) / Ghi chú</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {CHARACTERISTICS_LIST.map((item) => {
            const config = characteristics[item.key as keyof RelatedCharacteristics];
            return (
              <tr key={item.key} className="hover:bg-slate-50/50">
                <td className="px-3 py-2 text-center text-slate-500 border-r border-slate-200">
                  {item.code}
                </td>
                <td className="px-3 py-2 font-medium text-slate-900 border-r border-slate-200">
                  {item.label}
                </td>
                <td className="px-3 py-2 text-center border-r border-slate-200">
                  <input
                    type="checkbox"
                    checked={config.checked}
                    onChange={(e) =>
                      onChange(
                        item.key as keyof RelatedCharacteristics,
                        'checked',
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 rounded border-slate-300 accent-primary"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={config.note}
                    onChange={(e) =>
                      onChange(item.key as keyof RelatedCharacteristics, 'note', e.target.value)
                    }
                    disabled={!config.checked}
                    className="w-full text-sm px-2 py-1 rounded border border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder={item.notePlaceholder}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
