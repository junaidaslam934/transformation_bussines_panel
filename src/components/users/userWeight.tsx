// NOTE: Make sure to install 'recharts' with: npm install recharts

'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
import UserService from "@/services/userService";

// Type for API response
interface MetricHistoryResponse {
  success: boolean;
  data: {
    firstValue: number;
    currentValue: number;
    history: Array<{
      _id: string;
      date: string;
      value: number;
    }>;
    monthlyAverages: Array<{
      averageValue: number;
      month: number;
      year: number;
    }>;
    unit: string;
  };
  code: string;
}

// Type for a single data point
interface MetricDataPoint {
  month: string;
  value: number | null;
}

const periods = [
  { key: "6months", label: "6 month" },
  { key: "year", label: "Year" },
  { key: "lifetime", label: "Lifetime" },
];

const Userweight = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const metricType = searchParams.get("type") || "WEIGHT";
  const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];
  
  const [period, setPeriod] = useState("6months");
  const [loading, setLoading] = useState(false);
  const [metricData, setMetricData] = useState<MetricHistoryResponse["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch metric history data
  useEffect(() => {
    const fetchMetricHistory = async () => {
      if (!userId || !metricType) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await UserService.getMetricHistory(userId, metricType, period);
        if (response.success) {
          setMetricData(response.data);
        } else {
          setError('Failed to fetch metric history');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch metric history');
        console.error('Error fetching metric history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricHistory();
  }, [userId, metricType, period]);

  // Generate chart data from API response
  const chartData: MetricDataPoint[] = useMemo(() => {
    if (!metricData?.monthlyAverages) return [];
    
    return metricData.monthlyAverages.map((monthly) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return {
        month: monthNames[monthly.month - 1] || "Unknown",
        value: monthly.averageValue
      };
    });
  }, [metricData]);

  const start = metricData?.firstValue || 0;
  const current = metricData?.currentValue || 0;
  const unit = metricData?.unit || "kg";

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading metric history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 w-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 w-full">
      <div className="font-adelle text-[30px] font-normal text-black pb-6">{metricType.charAt(0) + metricType.slice(1).toLowerCase()}</div>
      <div className="flex gap-4 mb-4 pb-10">
        <div className="flex-1 bg-white border border-gray-200 rounded-[7px] p-6 flex flex-col justify-between min-h-[110px]">
          <div className="text-gray-500 text-base mb-2">Start</div>
          <div className="font-condor font-medium text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">
            {start} <span className="font-condor font-medium text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">{unit.toLowerCase()}</span>
          </div>
        </div>
        <div className="flex-1 bg-white border border-gray-200 rounded-[7px] p-6 flex flex-col justify-between min-h-[110px]">
          <div className="text-gray-500 text-base mb-2">Current</div>
          <div className="font-condor font-medium text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">
            {current} <span className="font-condor font-medium text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">{unit.toLowerCase()}</span>
          </div>
        </div>
        <div className="flex-1 bg-white border border-gray-200 rounded-[7px] p-6 flex flex-col justify-between min-h-[110px]">
          <div className="text-gray-500 text-base mb-2">Goal</div>
          <div className="font-condor font-medium text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">
            {current} <span className="font-condor font-medium text-[32px] leading-[100%] tracking-[0.032em] text-gray-800">{unit.toLowerCase()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`py-2 px-4 rounded-[8px] font-light text-sm transition-colors duration-200 border 
              ${period === p.key
                ? 'bg-lightBrown text-black border-lightBrown'
                : 'bg-white text-gray-600 hover:text-black border-gray-200'}
            `}
          >
            {p.label}
          </button>
        ))}
      </div>
      
      <div className="w-full h-48 sm:h-56 md:h-72 max-w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 16, bottom: 0 }}
            barCategoryGap="60%"
          >
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 16, fill: "#888" }}
              width={56}
              tickFormatter={v => `${v} ${unit.toLowerCase()}`}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 16, fill: "#888" }}
            />
            <Bar
              dataKey="value"
              barSize={4}
              radius={[8, 8, 8, 8]}
              fill="#222"
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value === null ? "#eee" : "#222"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="font-adelle text-[30px] font-normal text-black pb-6">{metricType.charAt(0) + metricType.slice(1).toLowerCase()} History</div>
      <div className="flex flex-col gap-3">
        {metricData?.history?.map((h, i) => (
          <div key={h._id} className="bg-white border border-gray-200 rounded-[7px] px-4 py-3 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{h.value} {unit.toLowerCase()}</span>
              {i > 0 && (
                <span className="text-gray-500 text-lg font-semibold">
                  ({new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                </span>
              )}
            </div>
            <span className="text-gray-400 text-xs mt-2">{new Date(h.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        )) || (
          <div className="text-gray-500 text-center py-4">No history data available</div>
        )}
      </div>
    </div>
  );
};

export default Userweight;

