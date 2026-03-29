import React from 'react';
import type { TestItem } from '../../types/index';
import { getTestStatus, TEST_FLAG_STYLES } from '../../lib/utils/testStatusChecker';

interface TestTableProps {
  tests: TestItem[];
  onUpdateResult: (index: number, value: string) => void;
  showStatusColumn?: boolean;
}

export const TestTable: React.FC<TestTableProps> = ({
  tests,
  onUpdateResult,
  showStatusColumn = true,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-slate-700">
      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
        <tr>
          <th className="px-4 py-3 border-r border-slate-200">Tên xét nghiệm</th>
          <th className="px-4 py-3 border-r border-slate-200 w-32">Kết quả</th>
          {showStatusColumn && (
            <th className="px-4 py-3 border-r border-slate-200 w-16 text-center">Ghi chú</th>
          )}
          <th className="px-4 py-3 border-r border-slate-200 w-32">Chỉ số BT</th>
          <th className="px-4 py-3">Đơn vị</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {tests.map((test, index) => {
          const flag = getTestStatus(test.result, test.normalRange);
          return (
            <tr key={test.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-2 font-medium text-slate-900 border-r border-slate-200">
                {test.name}
              </td>
              <td className="px-4 py-2 border-r border-slate-200 p-0">
                <input
                  type="text"
                  value={test.result}
                  onChange={(e) => onUpdateResult(index, e.target.value)}
                  className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-inset focus:ring-2 focus:ring-primary outline-none"
                />
              </td>
              {showStatusColumn && (
                <td className="px-4 py-2 border-r border-slate-200 text-center font-bold">
                  {flag && (
                    <span className={TEST_FLAG_STYLES[flag]}>{flag}</span>
                  )}
                </td>
              )}
              <td className="px-4 py-2 border-r border-slate-200 text-slate-700">
                {test.normalRange}
              </td>
              <td className="px-4 py-2 text-slate-500 bg-slate-50/30">{test.unit}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
