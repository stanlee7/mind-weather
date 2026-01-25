'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { MoodData } from '@/app/actions/moodStats';

interface MoodChartProps {
    data: MoodData[];
}

export default function MoodChart({ data }: MoodChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-32 flex items-center justify-center text-gray-500 text-xs">
                데이터가 충분하지 않습니다.
            </div>
        );
    }

    // Custom tooltip formatter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatTooltip = (value: any) => [`${value}점`, '기분 점수'];

    return (
        <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        {/* Fill Gradient (Vertical) */}
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        {/* Stroke Gradient (Horizontal) */}
                        <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(31, 41, 55, 0.9)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '1rem',
                            color: '#fff',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#a78bfa' }}
                        formatter={formatTooltip}
                        labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        name="기분 점수"
                        stroke="url(#strokeGradient)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                        style={{ filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.3))' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
