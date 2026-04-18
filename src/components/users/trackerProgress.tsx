'use client';

import React, { useState, useEffect } from "react";
import ICONS from '@/assets/icons';
import UserService from '@/services/userService';
import { errorToast } from '@/lib/toasts';

const nutritionData = [
  { day: "Mon", calories: 2156, protein: "10g", carb: "20g", fats: "5g", fiber: "3g" },
  { day: "Tue", calories: 3265, protein: "65g", carb: "25g", fats: "22g", fiber: "32g" },
  { day: "Wed", calories: 2856, protein: "88g", carb: "65g", fats: "22g", fiber: "40g" },
  { day: "Thu", calories: 1865, protein: "22g", carb: "35g", fats: "12g", fiber: "20g" },
  { day: "Fri", calories: 3502, protein: "102g", carb: "55g", fats: "15g", fiber: "50g" },
  { day: "Sat", calories: "-", protein: "-", carb: "-", fats: "-", fiber: "-" },
  { day: "Sun", calories: "-", protein: "-", carb: "-", fats: "-", fiber: "-" },
];

const hydrationData = [5, 7, 8, 6, 8, null, null]; // in L, for Mon-Sun
const maxHydration = 8;
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface TrackerProgressProps {
  userId?: string;
  selectedDate?: string;
}

export default function TrackerProgress({ userId, selectedDate }: TrackerProgressProps) {
  const [selectedWeightDay, setSelectedWeightDay] = useState("Mon");
  const [selectedWorkoutDay, setSelectedWorkoutDay] = useState("Mon");
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const daysArr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  
  // Use provided selectedDate or default to current date
  const dateToUse = selectedDate || new Date().toISOString().split('T')[0];

  // Fetch weekly data
  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await UserService.getWeekInReview(userId, dateToUse);
        
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
  }, [userId, dateToUse]);

  // Generate nutrition data from API
  const generateNutritionData = () => {
    if (!weeklyData?.macroMealData) return nutritionData;
    
    return dayKeys.map((dayKey, index) => {
      const dayData = weeklyData.macroMealData[dayKey];
      return {
        day: daysArr[index],
        calories: dayData?.calories || "-",
        protein: dayData?.protein ? `${dayData.protein}g` : "-",
        carb: dayData?.carbs ? `${dayData.carbs}g` : "-",
        fats: dayData?.fat ? `${dayData.fat}g` : "-",
        fiber: dayData?.fiber ? `${dayData.fiber}g` : "-"
      };
    });
  };

  // Generate hydration data from API
  const generateHydrationData = () => {
    if (!weeklyData?.hydrationData) return hydrationData;
    
    return dayKeys.map(dayKey => {
      const hydration = weeklyData.hydrationData[dayKey];
      return hydration && hydration > 0 ? hydration : null;
    });
  };

  // Generate weight data from API
  const generateWeightData = () => {
    if (!weeklyData?.weightData) return [83, 84, 84, 83, 84, null, null];
    
    return dayKeys.map(dayKey => {
      const weight = weeklyData.weightData[dayKey];
      return weight && weight > 0 ? weight : null;
    });
  };

  // Get workout data for selected day
  const getWorkoutData = () => {
    if (!weeklyData?.workouts) return [];
    
    const selectedDayKey = dayKeys[daysArr.indexOf(selectedWorkoutDay)];
    const dayWorkouts = weeklyData.workouts[selectedDayKey];
    
    const workouts: Array<{
      type: string;
      name: string;
      icon: string;
    }> = [];
    
    // Add daily workouts
    if (dayWorkouts?.dailyworkout?.length > 0) {
      dayWorkouts.dailyworkout.forEach((workout: any) => {
        workouts.push({
          type: "Daily Workout",
          name: workout.workoutType || "Daily Workout",
          icon: ICONS.activity1
        });
      });
    }
    
    // Add custom workouts
    if (dayWorkouts?.customworkout?.length > 0) {
      dayWorkouts.customworkout.forEach((workout: any) => {
        workouts.push({
          type: "Custom Workout",
          name: workout.workoutType || "Custom Workout",
          icon: ICONS.activity2
        });
      });
    }
    
    // Add workout plans
    if (dayWorkouts?.workoutplans?.length > 0) {
      dayWorkouts.workoutplans.forEach((workout: any) => {
        workouts.push({
          type: "Workout Plan",
          name: workout.workoutType || "Workout Plan",
          icon: ICONS.activity3
        });
      });
    }
    
    return workouts;
  };

  const nutritionDataFromAPI = generateNutritionData();
  const hydrationDataFromAPI = generateHydrationData();
  const weightDataFromAPI = generateWeightData();
  const workoutData = getWorkoutData();

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weekly data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 w-full">
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
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 w-full">
  
    <div className="w-full flex flex-col md:flex-row gap-6 p-0 sm:p-6 mb-6">
      {/* Nutrition Summary Card */}
      <div className="w-full md:flex-1 bg-white border border-gray-200 rounded-[7px] p-4 sm:p-6 min-w-0 md:min-w-[320px]">
        <div className="flex justify-between items-center mb-4">
          <span className="font-adelle text-lg sm:text-xl md:text-2xl font-bold">Weekly Nutrition Summary</span>
          <span className="text-right text-blacks text-xs sm:text-sm md:text-base">Plan:<br/>Calorie / macro tracking</span>
        </div>
        <div className="border-b border-gray-200 mb-4" />
        <div className="overflow-x-auto scrollbar-hide pt-4">
          <table className="w-full text-center ">
            <thead>
              <tr>
                <th className="font-ceraPro font-light text-[12px] sm:text-[14px] leading-[15.2px] text-lightGray text-center pb-4"></th>
                <th className="font-ceraPro font-light text-[12px] sm:text-[14px] leading-[15.2px] text-lightGray text-center pb-4">Calories</th>
                <th className="font-ceraPro font-light text-[12px] sm:text-[14px] leading-[15.2px] text-lightGray text-center pb-4">Protein</th>
                <th className="font-ceraPro font-light text-[12px] sm:text-[14px] leading-[15.2px] text-lightGray text-center pb-4">Carb</th>
                <th className="font-ceraPro font-light text-[12px] sm:text-[14px] leading-[15.2px] text-lightGray text-center pb-4">Fats</th>
                <th className="font-ceraPro font-light text-[12px] sm:text-[14px] leading-[15.2px] text-lightGray text-center pb-4">Fiber</th>
              </tr>
            </thead>
            <tbody>
              {nutritionDataFromAPI.map((row, i) => (
                <tr key={row.day} className="text-gray-800 text-base ">
                  <td className="font-adelle font-normal text-left px-2 py-2">{row.day}</td>
                  {["calories", "protein", "carb", "fats", "fiber"].map((key) => (
                    <td key={key} className="px-2 py-2">
                      <span className="font-ceraPro font-normal text-[12px] sm:text-[14px] leading-[15.2px] tracking-[0px] text-center w-full inline-block min-w-[48px] px-3 sm:px-5 py-1 bg-gray-100 rounded-[7px]">
                        {row[key as keyof typeof row]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Hydration Tracker Card */}
      <div className="w-full md:flex-1 bg-white border border-gray-200 rounded-[7px] p-4 sm:p-6 min-w-0 md:min-w-[320px] flex flex-col">
        <span className="font-adelle text-lg sm:text-xl md:text-2xl font-bold pt-3">Weekly Hydration Tracker</span>
        <div className="border-b border-gray-200 mb-4 pt-5" />
        <div className="flex flex-row items-end overflow-x-auto scrollbar-hide min-w-0 w-full max-w-full" style={{height: '320px'}}>
          {/* Y-axis */}
          <div className="relative h-full pr-4 text-darkGray text-xs sm:text-base font-sans" style={{minWidth: '32px'}}>
            {(() => {
              const validHydration = hydrationDataFromAPI.filter(h => h !== null && h > 0);
              if (validHydration.length === 0) {
                return [8, 5, 3, 1].map((v) => (
                  <span
                    key={v}
                    className="absolute left-0"
                    style={{
                      bottom: `calc(${((v - 1) / (8 - 1)) * 80 + 10}%)`,
                      transform: 'translateY(50%)',
                    }}
                  >
                    {v}L
                  </span>
                ));
              }
              const maxHydrationValue = Math.max(...validHydration);
              const maxHydrationDisplay = Math.ceil(maxHydrationValue);
              const step = Math.max(1, Math.ceil(maxHydrationDisplay / 4));
              return Array.from({length: 4}, (_, i) => maxHydrationDisplay - (i * step)).map((v) => (
                <span
                  key={v}
                  className="absolute left-0"
                  style={{
                    bottom: `calc(${((v - 1) / (maxHydrationDisplay - 1)) * 80 + 10}%)`,
                    transform: 'translateY(50%)',
                  }}
                >
                  {v}L
                </span>
              ));
            })()}
          </div>
          {/* Bars and labels */}
          <div className="flex flex-1 items-end h-full w-full max-w-full gap-2 sm:gap-4 min-w-[420px] sm:min-w-0">
            {hydrationDataFromAPI.map((val, i) => (
              <div key={i} className="flex flex-col items-center flex-1 min-w-[48px] sm:min-w-0 h-full">
                {/* Label ABOVE */}
                <span className="w-10 sm:w-12 text-center text-lightGray text-xs sm:text-base font-sans mb-4">{days[i]}</span>
                {/* Bar */}
                <div className="relative w-8 sm:w-10 h-full flex flex-col-reverse">
                  <div className="absolute bottom-0 left-0 w-8 sm:w-10 h-full rounded-[7px] bg-gray-100" />
                  {typeof val === 'number' && val > 0 && (
                    <div
                      className="absolute bottom-0 left-0 w-8 sm:w-10 rounded-[7px] bg-blue-400"
                      style={{ 
                        height: (() => {
                          const validHydration = hydrationDataFromAPI.filter(h => h !== null && h > 0);
                          const maxHydrationValue = validHydration.length > 0 ? Math.max(...validHydration) : 8;
                          return `${(val / maxHydrationValue) * 100}%`;
                        })(), 
                        transition: 'height 0.3s' 
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    {/* New section: Weekly Workout & Weight Progress */}
    <div className="w-full flex flex-col md:flex-row gap-6 p-0 sm:p-6 pt-0 gap-y-6">
      {/* Weekly Workout Progress Card */}
      <div className="w-full md:flex-1 min-w-0 bg-white border border-gray-200 rounded-[7px] p-4 sm:p-6 flex flex-col">
        <span className="font-adelle text-lg sm:text-xl md:text-2xl font-bold">Weekly Workout Progress</span>
        <div className="border-b border-gray-200 my-4" />
        {/* Day Selector */}
        <div className="flex flex-wrap gap-2 mb-6 w-full min-w-0">
          {daysArr.map((d, i) => (
            <button
              key={d}
              onClick={() => setSelectedWorkoutDay(d)}
              className={`px-4 py-1 rounded-[7px] font-ceraPro text-xs sm:text-base font-normal border border-gray-200 transition-colors duration-150 ${selectedWorkoutDay === d ? "bg-darkGray text-white border-lightGray" : "bg-white text-lightGray hover:bg-gray-100"}`}
            >
              {d}
            </button>
          ))}
        </div>
        {/* Workout Cards */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 w-full min-w-0">
          {workoutData.length > 0 ? (
            workoutData.map((workout, index) => (
              <div key={index} className="flex-1 w-full min-w-0 flex items-center gap-3 bg-white border border-gray-200 rounded-[7px] p-4">
                <img src={workout.icon} alt={workout.name} className="w-12 h-12 rounded-[7px] object-cover" />
                <div className="flex-1 min-w-0">
                  <span className="block font-ceraPro font-bold text-xs sm:text-base text-darkGray leading-tight truncate">
                    {workout.name.split(' ').map((word: string, i: number) => (
                      <span key={i}>
                        {word}
                        {i < workout.name.split(' ').length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </div>
                <img src={ICONS.arrow} alt="arrow" className="w-6 h-6" style={{ filter: 'invert(46%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(90%) contrast(90%)' }} />
              </div>
            ))
          ) : (
            <div className="flex-1 w-full min-w-0 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-[7px] p-4">
              <span className="text-gray-500 text-sm">No workouts for {selectedWorkoutDay}</span>
            </div>
          )}
        </div>
        {/* Workout count indicator */}
        {workoutData.length > 0 && (
          <div className="w-full flex justify-center text-darkGray text-base sm:text-lg font-ceraPro">
            +{workoutData.length}
          </div>
        )}
      </div>
      {/* Weekly Weight Progress Card */}
      <div className="flex-1 w-full min-w-0 bg-white border border-gray-200 rounded-[7px] p-4 sm:p-6 flex flex-col">
        <span className="font-adelle text-lg sm:text-xl md:text-2xl font-bold">Weekly Weight Progress</span>
        <div className="border-b border-gray-200 my-4" />
        <div className="flex flex-row items-end w-full max-w-full min-w-0 overflow-x-auto scrollbar-hide" style={{height: '180px'}}>
          {/* Y-axis */}
          <div className="flex flex-col justify-between h-full pr-2 text-darkGray text-xs md:text-base font-sans min-w-0 w-10 pb-6 md:w-14">
            {(() => {
              const validWeights = weightDataFromAPI.filter(w => w !== null && w > 0);
              if (validWeights.length === 0) {
                return [85, 84, 83, 82, 81].map((v) => (
                  <span key={v} className="whitespace-nowrap">{v} kg</span>
                ));
              }
              const minWeight = Math.floor(Math.min(...validWeights));
              const maxWeight = Math.ceil(Math.max(...validWeights));
              const range = maxWeight - minWeight;
              const step = Math.max(1, Math.ceil(range / 4));
              return Array.from({length: 5}, (_, i) => maxWeight - (i * step)).map((v) => (
                <span key={v} className="whitespace-nowrap">{v} kg</span>
              ));
            })()}
          </div>
          {/* Bars and day labels */}
          <div className="flex flex-1 items-end justify-between h-full w-full max-w-full min-w-0">
            {weightDataFromAPI.map((val, i) => {
              const validWeights = weightDataFromAPI.filter(w => w !== null && w > 0);
              const minWeight = validWeights.length > 0 ? Math.min(...validWeights) : 81;
              const maxWeight = validWeights.length > 0 ? Math.max(...validWeights) : 85;
              const range = maxWeight - minWeight;
              
              return (
                <div key={i} className="flex flex-col items-center flex-1 min-w-0 h-full">
                  {/* Bar */}
                  <div className="relative w-2 h-full flex flex-col-reverse">
                    <div className="absolute bottom-0 left-0 w-2 h-full rounded-[7px] pt- bg-gray-100" />
                    {typeof val === 'number' && val > 0 && (
                      <div
                        className="absolute bottom-0 left-0 w-2 rounded-[7px] bg-black"
                        style={{ 
                          height: range > 0 ? `${((val - minWeight) / range) * 100}%` : '50%', 
                          transition: 'height 0.3s' 
                        }}
                      />
                    )}
                  </div>
                  {/* Day label */}
                  <span className="w-8 md:w-12 text-center text-lightGray text-xs md:text-base font-sans mt-4 truncate">{daysArr[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

