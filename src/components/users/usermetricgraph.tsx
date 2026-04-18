// NOTE: Make sure to install 'recharts' with: npm install recharts

'use client';

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import ICONS from '@/assets/icons';

// Type for a single data point
interface WaistDataPoint {
  month: string;
  value: number | null;
}

const waistData: { [key: string]: WaistDataPoint[] } = {
  "6month": [
    { month: "Jan", value: 25.5 },
    { month: "Feb", value: 26.2 },
    { month: "Mar", value: 27.0 },
    { month: "Apr", value: 28.5 },
    { month: "May", value: 27.8 },
    { month: "Jun", value: null },
  ],
  year: [
    { month: "Jan", value: 25.5 },
    { month: "Feb", value: 26.2 },
    { month: "Mar", value: 27.0 },
    { month: "Apr", value: 28.5 },
    { month: "May", value: 27.8 },
    { month: "Jun", value: 26.5 },
    { month: "Jul", value: 26.8 },
    { month: "Aug", value: 28.2 },
    { month: "Sep", value: 29.0 },
    { month: "Oct", value: 28.7 },
    { month: "Nov", value: 28.2 },
    { month: "Dec", value: 27.9 },
  ],
  lifetime: Array.from({ length: 60 }, (_, i) => ({
    month: i % 12 === 0 ? "Jan" : i % 12 === 1 ? "Feb" : i % 12 === 2 ? "Mar" : i % 12 === 3 ? "Apr" : i % 12 === 4 ? "May" : i % 12 === 5 ? "Jun" : i % 12 === 6 ? "Jul" : i % 12 === 7 ? "Aug" : i % 12 === 8 ? "Sep" : i % 12 === 9 ? "Oct" : i % 12 === 10 ? "Nov" : "Dec", value: 25 + Math.sin(i / 5) * 2 + (i % 10) * 0.1 }))
};

const history = [
  { value: 27.5, diff: 0.68, date: "Feb 28, 2025" },
  { value: 26.5, diff: -0.28, date: "Feb 28, 2025" },
];

const periods = [
  { key: "6month", label: "6 month" },
  { key: "year", label: "Year" },
  { key: "lifetime", label: "Lifetime" },
];

interface UserMetricGraphProps {
  metric?: string;
}

const UserMetricGraph = ({ metric = "Waist" }: UserMetricGraphProps) => {
  const [period, setPeriod] = useState("6month");
  const chartData: WaistDataPoint[] = waistData[period];
  const start = chartData.find((d: WaistDataPoint) => d.value !== null)?.value ?? 0;
  const current = [...chartData].reverse().find((d: WaistDataPoint) => d.value !== null)?.value ?? 0;

  return (
    <div className="p-3 sm:p-6 bg-white dark:bg-gray-900 w-full">
      <div className="font-adelle text-xl sm:text-2xl md:text-[30px] font-normal text-black pb-4 sm:pb-6">{metric.charAt(0).toUpperCase() + metric.slice(1)}</div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:pb-10">
        <div className="flex-1 bg-white border border-gray-200 rounded-[7px] p-4 sm:p-6 flex flex-col justify-between min-h-[90px] sm:min-h-[110px]">
          <div className="text-gray-500 text-sm sm:text-base mb-1 sm:mb-2">Start</div>
          <div className="font-condor font-medium text-2xl sm:text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">
            {start.toFixed(2)} <span className="font-condor font-medium text-2xl sm:text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">in</span>
          </div>
        </div>
        <div className="flex-1 bg-white border border-gray-200 rounded-[7px] p-4 sm:p-6 flex flex-col justify-between min-h-[90px] sm:min-h-[110px]">
          <div className="text-gray-500 text-sm sm:text-base mb-1 sm:mb-2">Current</div>
          <div className="font-condor font-medium text-2xl sm:text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">
            {current.toFixed(2)} <span className="font-condor font-medium text-2xl sm:text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">in</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6 sm:mb-10 pt-4 sm:pt-6">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`py-2 px-4 rounded-[8px] font-light text-xs sm:text-sm transition-colors duration-200 border 
              ${period === p.key
                ? 'bg-lightBrown text-black border-lightBrown'
                : 'bg-white text-gray-600 hover:text-black border-gray-200'}
            `}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="w-full mb-4 sm:mb-6 flex items-center justify-center">
        {period === 'lifetime' ? (
          <img
            src={ICONS.yeargraph}
            alt="Lifetime Graph"
            className="w-full h-auto block"
          />
        ) : period === 'year' ? (
          <img
            src={ICONS.halfyear}
            alt="Year Graph"
            className="w-full h-auto block"
          />
        ) : period === '6month' ? (
          <img
            src={ICONS.monthly}
            alt="Monthly Graph"
            className="w-full h-auto block"
          />
        ) : null}
      </div>
      <div className="font-adelle text-xl sm:text-2xl md:text-[30px] font-normal text-black pb-4 sm:pb-6">{metric.charAt(0).toUpperCase() + metric.slice(1)} history</div>
      <div className="flex flex-col gap-2 sm:gap-3">
        {history.map((h, i) => (
          <div key={i} className="bg-white border border-gray-200  rounded-[7px] px-3 sm:px-4 py-2 sm:py-3 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold">{h.value} in</span>
              <span className={h.diff >= 0 ? "text-green-600 text-base sm:text-lg font-semibold" : "text-red-500 text-base sm:text-lg font-semibold"}>
                ({h.diff >= 0 ? "+" : ""}{h.diff.toFixed(2)})
              </span>
            </div>
            <span className="text-gray-400 text-xs mt-1 sm:mt-2">{h.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserMetricGraph;

