"use client"
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import WorkoutService from '@/services/workoutService';
import { IDailyWorkoutDay } from '@/types/api';

export default function WeeklyWorkoutSchedule() {
  // All hooks and state at the top!
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('workoutId');
  const selectedWeekParam = searchParams.get('selectedWeek');
  const router = useRouter();

  const [selectedWeek, setSelectedWeek] = useState(selectedWeekParam ? parseInt(selectedWeekParam) : 1);
  const [restDays, setRestDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: true
  });
  const [dailyWorkouts, setDailyWorkouts] = useState<IDailyWorkoutDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workoutId) return;
    setLoading(true);
    setError(null);
    WorkoutService.getDailyWorkouts(workoutId)
      .then(res => setDailyWorkouts(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [workoutId]);

  const weeks = [1, 2, 3, 4, 5, 6, 7, 8];

  // Helper: Days of the week in order
  const daysOfWeek = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];

  // Helper: Map day string to display name
  const dayDisplay: Record<string, string> = {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday',
  };

  // Filter dailyWorkouts for the selected week
  const weekWorkouts = dailyWorkouts
    ? dailyWorkouts.filter(dw => dw.week === selectedWeek)
    : [];

  // Map day to workout for quick lookup
  const dayToWorkout: Record<string, IDailyWorkoutDay | undefined> = {};
  weekWorkouts.forEach(dw => {
    dayToWorkout[dw.day] = dw;
  });

  const handleRestDayToggle = (day: string) => {
    setRestDays(prev => ({
      ...prev,
      [day]: !prev[day as keyof typeof prev]
    }));
  };
  const handleBackToWorkouts = () => {
    console.log('Back to workouts clicked');
    // Add navigation logic here
  };

  return (
    <>
      <div className="min-h-screen bg-white p-6">
        {/* Unified Weeks and Days Container */}
        <div>
          {/* Top Navigation - Weeks */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 rounded-lg p-1">
              {weeks.map((week) => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`px-4 py-2 rounded-[5px] border border-gray-200 text-sm font-medium transition-colors ${
                    selectedWeek === week
                      ? "bg-lightBrown  text-gray-800"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Week {week}
                </button>
              ))}
            </div>
          </div>
          {/* Loading and Error States */}
          {loading && <div className="text-center py-8">Loading workouts...</div>}
          {error && <div className="text-center text-red-500 py-8">{error}</div>}
          {/* Daily Workout Cards Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {daysOfWeek.map((day) => {
                const workout = dayToWorkout[day];
                return (
                  <div key={day} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-800">{dayDisplay[day]}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Rest day:</span>
                        <button
                          onClick={() => handleRestDayToggle(day.toLowerCase())}
                          className={`w-10 h-6 rounded-full transition-colors ${
                            restDays[day.toLowerCase() as keyof typeof restDays] ? 'bg-orange-200' : 'bg-gray-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                            restDays[day.toLowerCase() as keyof typeof restDays] ? 'transform translate-x-4' : 'transform translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {workout
                        ? workout.workoutDescription || workout.description || 'No description'
                        : 'No workout added'}
                    </p>
                    <div className="border-t border-gray-200 pt-4">
                      {workout ? (
                        <button className="w-full border border-black rounded-lg p-3 flex items-center justify-center hover:bg-gray-50">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <g>
                              <rect width="32" height="32" fill="white" fillOpacity="0" />
                              <path d="M20.5 10.5L21.5 11.5C22.0523 12.0523 22.0523 12.9477 21.5 13.5L13 22H10V19L18.5 10.5C19.0523 9.94772 19.9477 9.94772 20.5 10.5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <line x1="10" y1="25" x2="22" y2="25" stroke="black" strokeWidth="2" strokeLinecap="round" />
                            </g>
                          </svg>
                        </button>
                      ) : (
                        <button
                          className="w-full border border-black rounded-lg p-3 flex items-center justify-center hover:bg-gray-50"
                          onClick={() => {
                            if (!workoutId) return;
                            const url = `/content-management/adddayworkout?workoutId=${workoutId}&week=${selectedWeek}&day=${day}`;
                            router.push(url);
                          }}
                        >
                          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Back to Workouts Button on gray background */}
      <div className="flex justify-center mt-8 mb-8">
        <button
          onClick={handleBackToWorkouts}
          className="bg-lightBrown text-black border-lightgray font-semibold py-3 px-8 rounded-[7px] hover:lightBrown transition-colors"
        >
          Back to workouts
        </button>
      </div>
    </>
  );
}






