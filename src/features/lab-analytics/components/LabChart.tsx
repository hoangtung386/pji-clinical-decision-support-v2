import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { LabResult } from '../../../types/index';

interface LabChartProps {
  title: string;
  dataKey: string;
  threshold: number;
  color: string;
  unit: string;
  data: LabResult[];
}

export const LabChart: React.FC<LabChartProps> = ({
  title,
  dataKey,
  threshold,
  color,
  unit,
  data,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500">
          Ngưỡng: &gt;{threshold} {unit}
        </p>
      </div>
      <div className="bg-slate-100 p-1.5 rounded-lg">
        <span className="material-symbols-outlined text-slate-500 text-[20px]">show_chart</span>
      </div>
    </div>
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <ReferenceLine
            y={threshold}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{ position: 'top', value: 'Giới hạn', fill: '#ef4444', fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);
