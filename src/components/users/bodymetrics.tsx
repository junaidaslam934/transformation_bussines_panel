"use client";

import React, { useEffect, useMemo, useState } from "react";
import ICONS from "@/assets/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import UserService from "@/services/userService";
import { IBodyMetricItem } from "@/types/api";

function getMetricIcon(type: string): string {
  const key = type.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(ICONS, key)) {
    // @ts-expect-error dynamic key access
    return ICONS[key];
  }
  return ICONS.weight;
}

const BodyMetrics = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const dateParam = searchParams.get("date");
  const date = useMemo(() => {
    if (dateParam) return dateParam;
    // default to today in yyyy-MM-dd
    return new Date().toISOString().split("T")[0];
  }, [dateParam]);

  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<IBodyMetricItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!userId || !date) return;
      try {
        setLoading(true);
        setError(null);
        const res = await UserService.getDailyBodyMetrics(userId, date);
        if (res.success) {
          setMetrics(res.data || []);
        } else {
          setMetrics([]);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to fetch body metrics");
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [userId, date]);

  return (
    <div className="p-4 bg-white">
      {loading ? (
        <div className="text-gray-600">Loading body metrics...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !metrics || metrics.length === 0 ? (
        <div className="text-gray-500">No body metrics found.</div>
      ) : (
        <div className="flex flex-col gap-4 ">
          {metrics.map((metric) => (
            <Link
              key={`${metric.type}-${metric.unit}`}
              href={`/user-management/body-metricGraphs/${metric.type.toLowerCase()}?userId=${encodeURIComponent(userId)}&date=${encodeURIComponent(date)}&type=${encodeURIComponent(metric.type)}`}
              className="no-underline"
            >
              <div className="flex items-center bg-white border border-gray-200 rounded-[7px] px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-150 cursor-pointer">
                <span className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-md mr-6">
                  <img src={getMetricIcon(metric.type)} alt={metric.type} className="w-10 h-10 object-contain" />
                </span>
                <div className="flex flex-col flex-1">
                  <span className="text-[20px] font-semibold text-gray-800">
                    {metric.value} <span className="text-[16px] font-normal text-gray-500">{metric.unit.toLowerCase()}</span>
                  </span>
                  <span className="text-gray-500 text-[15px] mt-1">{metric.type.charAt(0) + metric.type.slice(1).toLowerCase()}</span>
                </div>
                <span className="ml-auto text-gray-300">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )} 
    </div>
  );
};

export default BodyMetrics;
