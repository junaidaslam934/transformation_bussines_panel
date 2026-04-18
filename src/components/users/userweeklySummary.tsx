"use client";

import React, { useState, useEffect } from 'react';
import ICONS from '@/assets/icons';
import { Input } from '../ui/input';
import Link from "next/link";
import UserService from '@/services/userService';
import { errorToast } from '@/lib/toasts';
import { Button } from '../ui/button';

const weeklySummaries = [
  { range: '3 – 10 May' },
  { range: '11 – 17 May' },
  { range: '18 – 24 May' },
  { range: '25 – 31 May' },
  { range: '1 – 7 June' },
  { range: '8 – 14 June' },
  { range: '15 – 21 June' },
];

interface UserWeeklySummaryProps {
  userId?: string;
}

const UserWeeklySummary = ({ userId }: UserWeeklySummaryProps) => {
  const [search, setSearch] = useState('');
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Generate weekly summary data from API response
  const generateWeeklySummaries = (data: any) => {
    if (!data) return [];
    
    const summaries = [];
    
    // Get the current week's data
    const currentWeek = new Date();
    const weekStart = new Date(currentWeek);
    weekStart.setDate(currentWeek.getDate() - currentWeek.getDay() + 1); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday
    
    // Calculate weekly totals
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    let weeklyCalories = 0;
    let weeklyProtein = 0;
    let weeklyCarbs = 0;
    let weeklyFat = 0;
    let weeklyFiber = 0;
    let weeklyHydration = 0;
    let weeklyWorkouts = 0;
    let daysWithData = 0;
    
    for (const dayKey of days) {
      const dayData = data.macroMealData?.[dayKey];
      const hydration = data.hydrationData?.[dayKey] || 0;
      const workouts = data.workouts?.[dayKey] || { dailyworkout: [], customworkout: [], workoutplans: [] };
      
      if (dayData && (dayData.calories || dayData.protein || dayData.carbs || dayData.fat || dayData.fiber)) {
        weeklyCalories += dayData.calories || 0;
        weeklyProtein += dayData.protein || 0;
        weeklyCarbs += dayData.carbs || 0;
        weeklyFat += dayData.fat || 0;
        weeklyFiber += dayData.fiber || 0;
        daysWithData++;
      }
      
      if (hydration > 0) {
        weeklyHydration += hydration;
      }
      
      weeklyWorkouts += workouts.dailyworkout.length + workouts.customworkout.length + workouts.workoutplans.length;
    }
    
    // Check if there's any data for this week
    const hasData = daysWithData > 0 || weeklyHydration > 0 || weeklyWorkouts > 0;
    
    // Create weekly summary with original UI structure
    summaries.push({
      range: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      hasData: hasData,
      daysWithData: daysWithData,
      calories: weeklyCalories,
      protein: weeklyProtein,
      carbs: weeklyCarbs,
      fat: weeklyFat,
      fiber: weeklyFiber,
      hydration: weeklyHydration,
      workouts: weeklyWorkouts
    });
    
    return summaries;
  };

  const filteredSummaries = weeklyData ? 
    generateWeeklySummaries(weeklyData).filter(s =>
      s.range.toLowerCase().includes(search.toLowerCase())
    ) : [];

  // Fetch weekly data
  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await UserService.getWeekInReview(userId, selectedDate);
        
        if (response.success) {
          setWeeklyData(response.data);
        } else {
          setError('Failed to fetch weekly data');
        }
      } catch (err: any) {
        console.error('Error fetching weekly data:', err);
        const errorMessage = err?.message || 'Failed to fetch weekly data';
        setError(errorMessage);
        errorToast(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [userId, selectedDate]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white w-full px-2 sm:px-4">
        <div className="w-full py-6 sm:py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading weekly data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white w-full px-2 sm:px-4">
        <div className="w-full py-6 sm:py-10">
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
      </div>
    );
  }

  return (
    <div className="bg-white w-full px-2 sm:px-4">
      <div className="w-full py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <span className="font-adelle text-[18px] font-medium text-black">Weekly summary</span>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* <div className="relative w-full sm:w-80">
              <Input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-[3px] border border-gray-200 bg-white text-[15px] font-ceraPro text-black focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div> */}
            <div className="relative w-full sm:w-80">
              <Input
                type="text"
                placeholder="Search date..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-[3px] border border-gray-200 bg-white text-[15px] font-ceraPro text-black focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-2-2"/></svg>
            </div>
          </div>
        </div>
        
        {filteredSummaries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No weekly data found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
                        {filteredSummaries.map((summary, idx) => (
              <Link
                key={idx}
                href={`/user-management/progress-trackers?userId=${userId}&selectedDate=${selectedDate}`}
                className="bg-white border border-gray-200 rounded-[7px] flex items-center px-4 sm:px-5 py-3 sm:py-4 gap-3 sm:gap-4 shadow-sm hover:bg-gray-50 transition-colors"
                style={{ textDecoration: "none" }}
              >
                <div className="bg-[#F5F5F5] rounded-lg w-12 h-12 flex items-center justify-center">
                  <img src={ICONS.UserWeeklySummarygraph} alt="summary" className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-black text-[15px] mb-1 font-ceraPro truncate">My Weekly Summary</div>
                  <div className="text-[15px] text-[#333] font-light font-ceraPro truncate">{summary.range}</div>
                  {summary.hasData ? (
                    <div className="text-xs text-gray-500 mt-1">
                      {summary.daysWithData > 0 && `Calories: ${summary.calories} | `}
                      {summary.hydration > 0 && `Hydration: ${summary.hydration.toFixed(1)}L | `}
                      {summary.workouts > 0 && `Workouts: ${summary.workouts}`}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1">No data available for this week</div>
                  )}
                </div>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWeeklySummary; 
