"use client"
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import ICONS from '@/assets/icons';

interface DailyWorkout {
  _id: string;
  workoutId: {
    _id: string;
    title: string;
    tagLine: string;
    description: string;
    durationInWeeks: number;
    level: string;
    focusArea: string;
    equipment: string;
    workoutImage: string | null;
  };
  week: number;
  day: string;
  workoutType: string;
  description: string;
  workoutDescription: string;
  isRestDay: boolean;
}

interface WorkoutDetailsData {
  success: boolean;
  data: DailyWorkout[];
}

export default function WorkoutDetails() {
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('workoutId');
  const initialWeek = parseInt(searchParams.get('week') || '1');
  const selectedDay = searchParams.get('day');
  
  const [activeWeek, setActiveWeek] = useState(initialWeek - 1); // Convert to 0-based index for array
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [dailyWorkouts, setDailyWorkouts] = useState<DailyWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(selectedDay || null);

  // Generate weeks array based on workout duration
  const generateWeeks = (durationInWeeks: number) => {
    return Array.from({ length: durationInWeeks }, (_, i) => ({
      label: `Week ${i + 1}`,
      weekNumber: i + 1
    }));
  };

  const weeks = workoutData ? generateWeeks(workoutData.durationInWeeks) : [];

  // Fetch workout details and daily workouts
  useEffect(() => {
    const fetchWorkoutData = async () => {
      if (!workoutId) return;

      try {
        setLoading(true);
        setError(null);

        // Build URL with optional day filter
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
        const weekParam = activeWeek + 1; // Convert back to 1-based for API
        const dayQuery = selectedDay ? `&day=${selectedDay}` : '';
        const url = `${baseUrl}/daily-workouts?workoutId=${workoutId}&week=${weekParam}${dayQuery}`;

        console.log('Fetching workout data:', { workoutId, week: weekParam, day: selectedDay, url });

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
          },
        });

        if (response.ok) {
          const data: WorkoutDetailsData = await response.json();
          setDailyWorkouts(data.data);
          
          // Set workout data from the first daily workout (they all have the same workoutId data)
          if (data.data.length > 0) {
            setWorkoutData(data.data[0].workoutId);
          }
        } else {
          setError('Failed to fetch workout data');
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
        setError('Failed to fetch workout data');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, [workoutId, activeWeek, selectedDay]);

  // Handle week change
  const handleWeekChange = (weekIndex: number) => {
    console.log('Changing week from', activeWeek, 'to', weekIndex);
    setActiveWeek(weekIndex);
  };

  // Convert API day data to display format
  const convertDayData = (dailyWorkouts: DailyWorkout[]) => {
    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return dayOrder.map((day, index) => {
      const workout = dailyWorkouts.find(w => w.day === day);
      if (workout) {
        return {
          day: dayNames[index],
          title: workout.workoutType,
          desc: workout.workoutDescription,
          isRestDay: workout.isRestDay
        };
      } else {
        return {
          day: dayNames[index],
          title: "No workout scheduled",
          desc: "No workout description available",
          isRestDay: true
        };
      }
    });
  };

  const weekData = convertDayData(dailyWorkouts);
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        <span className="ml-3 text-gray-600">Loading workout details...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // No workout data
  if (!workoutData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-sm text-gray-500">No workout data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-2 sm:px-4 md:px-8 py-0">
      {/* Left: Workout Info Card (single card) */}
      <div className="bg-white border border-gray-200 p-0 w-full lg:w-auto lg:min-w-[320px] lg:max-w-md flex-shrink-0 flex flex-col mb-6 lg:mb-0 mx-auto lg:mx-0">
        <div className="p-4 sm:p-6 pb-0">
          <img
            src={workoutData.workoutImage || ICONS.bumbelup}
            alt={workoutData.title}
            className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-[7px]"
          />
        </div>
        <div className="p-4 sm:p-6 pt-0 flex flex-col flex-1">
          <span className="font-adelle text-[17px] font-medium text-gray-800 -mt-6">{workoutData.title}</span>
          <div className="border-b border-gray-200 mb-4"></div>
          <div className="text-gray-600 text-sm sm:text-base mb-4">
            {workoutData.description}
          </div>
          <div className="flex gap-2 mb-6">
            <span className="bg-lightBrown text-darkgray text-xs font-medium rounded-[7px] px-3 py-1">{workoutData.level}</span>
            <span className="bg-gray-100 text-gray-500 text-xs font-medium rounded-[7px] px-3 py-1">{workoutData.durationInWeeks} Weeks</span>
          </div>
          <button className="w-full bg-lightBrown text-black font-semibold py-2 rounded-[7px] mt-auto">Edit details</button>
        </div>
      </div>
      {/* Right: Week Schedule Card (single card) */}
      <div className="bg-white border border-gray-200 flex-1 w-full p-4 sm:p-6 shadow-sm flex flex-col">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
          {weeks.map((w, i) => (
            <button
              key={w.label}
              onClick={() => handleWeekChange(i)}
              className={`px-4 sm:px-6 py-3 rounded-[7px] text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeWeek === i 
                  ? "bg-lightBrown text-black border-0 font-semibold" 
                  : "bg-white text-gray-700 border border-lightGray"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {weekData.map((d, idx) => (
            <div key={idx} className={`border rounded-[7px] p-4 flex flex-col min-h-[110px] ${activeDay && d.day.toUpperCase() === activeDay ? 'border-black bg-[#fff7ee]' : 'border-gray-200 bg-transparent'}`}>
              <div className="font-adelle font-bold text-lg mb-1">{d.day}</div>
              <div className="text-darkGray text-base mb-4">{d.title}</div>
              <div className="border-b border-gray-200 mb-2"></div>
              <div className="text-darkGray text-base mb-4">{d.desc}</div>
              <button className="mt-auto border border-darkGray rounded-[7px] py-2 flex items-center justify-center text-lg font-bold text-black hover:bg-gray-100 transition">
                <span className="sr-only">Go</span>
                <img src={ICONS.arrowhead} alt="arrow" className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}