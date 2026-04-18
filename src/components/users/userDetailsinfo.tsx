"use client"

import React, { useState, useEffect } from "react";
import ICONS from '@/assets/icons';
import { Progress } from "@/components/ui/progress";
import { icons } from "lucide-react";
import Link from "next/link";
// TODO: If not present, add shadcn/ui DatePicker component at '@/components/ui/date-picker'
import { DatePicker } from '@/components/ui/date-picker';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { IUser, IUserActivity, IBodyMetricItem } from "@/types/api";
import UserService from "@/services/userService";

interface CircularProgressProps {
  value: number;
  max: number;
  unit?: string;
}

function CircularProgress({ value, max, unit = "" }: CircularProgressProps) {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(value / max, 1);
  const strokeDashoffset = circumference - percent * circumference;
  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg height={radius * 2} width={radius * 2} className="block">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#111"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center" style={{ transform: 'translate(-50%, -50%)' }}>
        <span className="text-3xl font-bold text-darkGray">{value}{unit}</span>
        <span className="text-base text-lightGray">Goal: {max}{unit}</span>
      </div>
    </div>
  );
}

interface UserDetailsInfoProps {
  userId: string;
}

// Helper for safe icon lookup
function getMetricIcon(type: string): string {
  const key = type.toLowerCase();
  // Only allow keys that exist in ICONS
  if (Object.prototype.hasOwnProperty.call(ICONS, key)) {
    // @ts-expect-error: dynamic access is safe here
    return ICONS[key];
  }
  return ICONS.weight;
}

export default function UserDetailsInfo({ userId }: UserDetailsInfoProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [user, setUser] = useState<IUser | null>(null);
  const [userActivity, setUserActivity] = useState<IUserActivity | null>(null);
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [bodyMetrics, setBodyMetrics] = useState<IBodyMetricItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await UserService.getUserById(userId);
        console.log('User data received:', response.data);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user details');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Fetch user activity data
  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!userId || !date) return;
      
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const response = await UserService.getUserActivityByDate(userId, formattedDate);
        console.log('User activity data received:', response.data);
        setUserActivity(response.data);
      } catch (err) {
        console.error('Error fetching user activity:', err);
        // Don't set error state for activity as it's optional
        setUserActivity(null);
      }
    };

    fetchUserActivity();
  }, [userId, date]);

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
      
      if (dayData) {
        weeklyCalories += dayData.calories || 0;
        weeklyProtein += dayData.protein || 0;
        weeklyCarbs += dayData.carbs || 0;
        weeklyFat += dayData.fat || 0;
        weeklyFiber += dayData.fiber || 0;
        daysWithData++;
      }
      
      weeklyHydration += hydration;
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

  // Fetch weekly data
  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!userId) return;
      
      try {
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const response = await UserService.getWeekInReview(userId, currentDate);
        
        if (response.success) {
          setWeeklyData(response.data);
        }
      } catch (err) {
        console.error('Error fetching weekly data:', err);
        // Don't set error state for weekly data as it's optional
      }
    };

    fetchWeeklyData();
  }, [userId]);

  // Fetch daily body metrics
  useEffect(() => {
    const fetchBodyMetrics = async () => {
      if (!userId || !date) return;
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const response = await UserService.getDailyBodyMetrics(userId, formattedDate);
        if (response.success) {
          setBodyMetrics(response.data);
        } else {
          setBodyMetrics(null);
        }
      } catch (err) {
        setBodyMetrics(null);
      }
    };
    fetchBodyMetrics();
  }, [userId, date]);

  if (loading) {
    return (
      <div className="w-full min-h-screen pt-0 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-full min-h-screen pt-0 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'User not found'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Default activity values if no data from API
  const stepCount = userActivity?.stepCount || 0;
  const walkTime = userActivity?.walkTime || 0;
  const stepGoal = 10000;
  const walkGoal = 30;

  return (
    <div className="w-full min-h-screen pt-0 px-4 flex flex-col md:flex-row gap-6">
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-6 max-w-5xl lg:h-screen lg:overflow-y-auto scrollbar-hide">
        {/* Nutrition Card */}
        <div className="bg-white p  p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-adelle text-[17px] font-medium text-gray-800 pt-4">Nutrition <span className="text-xs text-lightGray">(Calorie/ Macro tracking)</span></span>
            <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-2 text-lightGray text-sm cursor-pointer select-none">
              <img src={ICONS.calederDate} alt="Calendar" className="w-4 h-4" />
              <span>{date ? format(date, "MMMM d, yyyy") : "Pick a date"}</span>
              <img src={ICONS.datepickerdropdowner} alt="dropdown" className="w-3 h-3 ml-1" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
          </div>
          {/* Macro cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {[
              { label: "Calories", value: user.targetCalories || user.suggestedCalories || 0, goal: 2500, color: "bg-yellow-400", bar: "bg-yellow-400" },
              { label: "Protein (g)", value: user.targetProteins || user.suggestedProteins || 0, goal: 150, color: "bg-green-400", bar: "bg-green-400" },
              { label: "Carbs (g)", value: user.targetCarbs || user.suggestedCarbs || 0, goal: 300, color: "bg-red-400", bar: "bg-red-400" },
              { label: "Fats (g)", value: user.targetFats || user.suggestedFats || 0, goal: 70, color: "bg-blue-400", bar: "bg-blue-400" },
            ].map((macro) => {
                const percent = Math.min((macro.value / macro.goal) * 100, 100);
                return (
                  <div key={macro.label} className="bg-white rounded-[10px] border border-gray-200 flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 min-h-[90px] sm:min-h-[110px] max-w-full w-full min-w-0">
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <span className="font-ceraPro font-normal text-xs sm:text-[13px] text-lightGray mb-0.5 sm:mb-1 truncate">{macro.label}</span>
                      <span className="text-2xl sm:text-3xl font-bold text-darkGray leading-tight truncate">
                        {macro.value}
                      </span>
                      <span className="text-xs sm:text-sm text-lightGray mt-0 truncate">Goal: {macro.goal}</span>
                    </div>
                    <div className="flex items-center h-16 sm:h-20 ml-2 sm:ml-4 flex-shrink-0">
                      <Progress
                        value={percent}
                        className="w-1.5 sm:w-2 h-full bg-gray-100"
                        indicatorClassName={`${macro.bar}`}
                        indicatorStyle={{ width: '100%' }}
                        vertical
                      />
                    </div>
                  </div>
                );
            })}
          </div>
          {/* Water and Fiber */}
          <div className="flex items-center gap-2 ">
            <div className="flex items-center bg-blue-400 h-14 px-16 min-w-[120px] rounded-l-[5px]">
              <img src={ICONS.watermark} alt="Water" className="w-6 h-6 mr-2" />
              <span className="text-white text-lg font-bold">1L</span>
              <span className="text-white text-base font-semibold">/8L</span>
            </div>
            <div className="flex-1 h-14 bg-white border-t border-b border-r border-gray-200 rounded-r-lg px-4" />
            <div className="flex flex-col justify-center items-center h-16 px-4 bg-white border border-gray-200 rounded ml-2 min-w-[80px]">
              <span className="text-xs text-lightGray">Fiber (g)</span>
              <span className="text-lg font-bold text-darkGray">24/40</span>
            </div>
          </div>
          <Link
            href={`/user-management/usermacro/${userId}`}
            className="w-full border-black border h-14 flex items-center rounded-[5px] justify-center mt-2 text-lightGray"
          >
            <img src={ICONS.Arrow} alt="arrow" className="w-6 h-5 " />
          </Link>
        </div>
        {/* Activity Card */}
        <div className="bg-white border border-gray-200  p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-adelle text-[17px] font-medium text-gray-800 pt-4">Activity</span>
            <Popover>
              <PopoverTrigger asChild>
                <span className="flex items-center gap-2 text-lightGray text-xs cursor-pointer select-none">
                  <img src={ICONS.calederDate} alt="calendar" className="w-4 h-4" />
                  {date ? format(date, "MMMM d, yyyy") : "Pick a date"}
                  <img src={ICONS.datepickerdropdowner} alt="dropdown" className="w-3 h-3 ml-1" />
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Activity Cards with real data from API */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Steps Counter */}
            <div className="bg-white border border-[#eee] rounded-[7px] flex flex-col items-center justify-center py-6">
              <div className="relative flex items-center justify-center mb-2">
                <svg width="100" height="100">
                  <circle cx="50" cy="50" r="45" stroke="#eee" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="45" stroke="#222" strokeWidth="8" fill="none" strokeDasharray={2*Math.PI*45} strokeDashoffset={2*Math.PI*45*(1-stepCount/stepGoal)} strokeLinecap="butt" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-800">{stepCount.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 font-normal">Goal: {stepGoal.toLocaleString()}</span>
                </div>
              </div>
              <div className="font-semibold text-gray-800 text-lg mt-2">Steps Counter</div>
            </div>
            {/* Walk Timer */}
            <div className="bg-white border border-[#eee] rounded-[7px] flex flex-col items-center justify-center py-6">
              <div className="relative flex items-center justify-center mb-2">
                <svg width="100" height="100">
                  <circle cx="50" cy="50" r="45" stroke="#eee" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="45" stroke="#222" strokeWidth="8" fill="none" strokeDasharray={2*Math.PI*45} strokeDashoffset={2*Math.PI*45*(1-walkTime/walkGoal)} strokeLinecap="butt" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-800">{walkTime}m</span>
                  <span className="text-xs text-gray-500 font-normal">Goal: {walkGoal}m</span>
                </div>
              </div>
              <div className="font-semibold text-gray-800 text-lg mt-2">Walk timer</div>
              
            </div>
          </div>
          <div className="bg-white rounded-[7px] p-0 md:p-0 flex flex-col gap-2 md:gap-4 relative">
            <span className="font-adelle text-base md:text-[17px] font-medium text-gray-800 pt-0">Workout plans</span>
            <Link
              href="/user-management/workout-plans"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-[7px] p-2 md:p-3 w-full hover:bg-gray-50 transition-colors"
              style={{ textDecoration: "none" }}
            >
              <img src={ICONS.activity1} alt="plan" className="w-20 h-20 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-ceraPro font-bold text-base text-darkGray leading-tight truncate">30 days beginner plan</span>
                  <img src={ICONS.Arrow} alt="arrow" className="w-5 h-5 text-gray-400 ml-2" />
                </div>
                <span className="block pt-6 text-xs text-gray-800">Week 3 day 5</span>
                <Progress value={19} max={30} className="h-[6px] mt-2 bg-gray-100" indicatorClassName="bg-gray-800" />
              </div>
            </Link>
          </div>
          <Link
            href={`/user-managemeworkont-plenscro/${userId}`}
            className="w-full border-black border h-14 flex items-center rounded-[5px] justify-center mt-2 text-lightGray"
          >
            <img src={ICONS.Arrow} alt="arrow" className="w-6 h-5 " />
          </Link>
        </div>
        {/* Workout Plans Card */}
       
      </div>
      {/* Right Column */}
      <div className="bg-white border border-gray-200  p-4 flex flex-col gap-4 max-w-xl w-full lg:h-screen lg:overflow-y-auto scrollbar-hide">
        {/* Profile Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-3 items-center">
            <div className="w-14 h-14 rounded-[7px] bg-lightBrown flex items-center justify-center font-bold text-3xl text-darkGray">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-darkGray leading-tight">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-lightGray">Together {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
         
       
          <a href="/user-management/user-info-edit" className="text-xs text-darkGray underline font-medium mt-1">View Profile</a>
        </div>
        {/* User Info Row */}
                  <div className="flex flex-col md:grid md:grid-cols-5 md:gap-2 w-full">
            <div className="flex flex-col items-start w-full mt-2 md:mt-0">
              <span className="text-[11px] text-lightGray">Gender:</span>
              <span className="font-condor font-medium text-[16px] leading-[100%] tracking-[0.032em] text-darkGray">
                {user.gender || 'N/A'}
              </span>
            </div>
            <div className="flex flex-col items-start w-full mt-2 md:mt-0">
              <span className="text-[11px] text-lightGray">Age:</span>
              <span className="font-condor font-medium text-[16px] leading-[100%] tracking-[0.032em] text-darkGray">
                {user.dateOfBirth ? Math.floor((new Date().getTime() - new Date(user.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col items-start w-full mt-2 md:mt-0">
              <span className="text-[11px] text-lightGray">Height:</span>
              <span className="font-condor font-medium text-[16px] leading-[100%] tracking-[0.032em] text-darkGray">
                {user.height ? `${user.height} ${user.heightUnit?.toLowerCase() || ''}` : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col items-start w-full mt-2 md:mt-0">
              <span className="text-[11px] text-lightGray">Goal:</span>
              <span className="font-condor font-medium text-[16px] leading-[100%] tracking-[0.032em] text-darkGray">
                {user.goal ? user.goal.replace(/_/g, ' ').toLowerCase() : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col items-start w-full mt-2 md:mt-0">
              <span className="text-[11px] text-lightGray">Training level:</span>
              <span className="font-condor font-medium text-[16px] leading-[100%] tracking-[0.032em] text-darkGray">
                {user.trainingLevel || 'N/A'}
              </span>
            </div>
          </div>
        {/* Progress Overview */}
        <div className="flex flex-col gap-2">
          <span className="font-adelle text-[17px] font-medium text-gray-800">Progress overview</span>
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2 w-sfull">
            <div className="border border-gray-200 rounded-[7px] px-6 py-3 flex flex-col items-start w-full">
              <span className="text-xs text-lightGray text-left pl-2">Start</span>
              <span className="text-lg font-bold text-darkGray text-left pl-2">
                {user.currentWeight ? `${user.currentWeight} ${user.currentWeightUnit?.toLowerCase() || 'lbs'}` : 'N/A'}
              </span>
            </div>
            <div className="border border-gray-200 rounded-[7px] px-6 py-3 flex flex-col items-start w-full">
              <span className="text-xs text-lightGray text-left pl-2">Current</span>
              <span className="text-lg font-bold text-darkGray text-left pl-2">
                {user.currentWeight ? `${user.currentWeight} ${user.currentWeightUnit?.toLowerCase() || 'lbs'}` : 'N/A'}
              </span>
            </div>
            <div className="border border-gray-200 rounded-[7px] px-6 py-3 flex flex-col items-start w-full">
              <span className="text-xs text-lightGray text-left pl-2">Goal</span>
              <span className="text-lg font-bold text-darkGray text-left pl-2">
                {user.weightGoal ? `${user.weightGoal} ${user.weightUnit?.toLowerCase() || 'lbs'}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        {/* Progress Pictures & Videos */}
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between items-center">
            <span className="font-adelle text-[17px] font-medium text-gray-800 pt-3">Progress pictures & videos</span>
            <Link href="/user-management/progress-pictures" className="text-xs text-lightGray underline">See more</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 w-full">
            {/* Card 1 */}
            <div className="relative w-full aspect-[3/4] rounded-[7px] overflow-hidden bg-gray-200">
              <img src="/assets/images/progresspic1.png" alt="progress" className="w-full h-full object-cover object-center" />
              <span className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">March 5</span>
              <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">1/2</span>
            </div>
            {/* Card 2 */}
            <div className="relative w-full aspect-[3/4] rounded-[7px] overflow-hidden bg-gray-200">
              <img src="/assets/images/progresspic2.png" alt="progress" className="w-full h-full object-cover object-center" />
              <span className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">March 4</span>
              <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">1/6</span>
            </div>
            {/* Card 3 */}
            <div className="relative w-full aspect-[3/4] rounded-[7px] overflow-hidden bg-gray-200">
              <img src="/assets/images/progresspic3.png" alt="progress" className="w-full h-full object-cover object-center" />
              <span className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">March 2</span>
              <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">1/3</span>
            </div>
            {/* Card 4 */}
            <div className="relative w-full aspect-[3/4] rounded-[7px] overflow-hidden bg-gray-200">
              <img src="/assets/images/progresspic4.png" alt="progress" className="w-full h-full object-cover object-center" />
              <span className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">March 1</span>
              <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">1/5</span>
            </div>
          </div>
        </div>
        {/* Weekly Summaries */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-adelle text-[17px] font-medium text-gray-800 pt-6">Weekly summaries</span>
            <Link href={`/user-management/weekly-summaries?userId=${userId}`} className="text-xs text-lightGray underline">See more</Link>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {/* Show recent weekly summaries from API */}
            {weeklyData ? (
              generateWeeklySummaries(weeklyData)
                .filter(summary => summary.hasData)
                .slice(0, 2) // Show only 2 most recent summaries with data
                .map((summary, idx) => (
                  <div key={idx} className="flex items-center border border-gray-200 rounded-[7px] px-4 py-5 bg-white">
                    <span className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded mr-3">
                      <img src={ICONS.UserWeeklySummarygraph} alt="summary" className="w-6 h-6" />
                    </span>
                    <div className="flex-1 flex flex-col">
                      <span className="font-bold text-darkGray text-sm">My Weekly summary</span>
                      <span className="text-xs text-darkGray">{summary.range}</span>
                    </div>
                    <span className="ml-2">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                ))
            ) : (
              // Fallback to static data if no API data
              <>
                <div className="flex items-center border border-gray-200 rounded-[7px] px-4 py-5 bg-white">
                  <span className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded mr-3">
                    <img src={ICONS.UserWeeklySummarygraph} alt="summary" className="w-6 h-6" />
                  </span>
                  <div className="flex-1 flex flex-col">
                    <span className="font-bold text-darkGray text-sm ">My Weekly summary</span>
                    <span className="text-xs text-darkGray">18 – 24 May</span>
                  </div>
                  <span className="ml-2">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
                <div className="flex items-center border border-gray-200 rounded-[7px] px-4 py-5 bg-white">
                  <span className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded mr-3">
                    <img src={ICONS.UserWeeklySummarygraph} alt="summary" className="w-6 h-6" />
                  </span>
                  <div className="flex-1 flex flex-col">
                    <span className="font-bold text-darkGray text-sm">My Weekly summary</span>
                    <span className="text-xs text-darkGray">11 – 17 May</span>
                  </div>
                  <span className="ml-2">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Body Metrics */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-adelle text-[17px] font-medium text-gray-800 pt-6">Body metrics</span>
            <Link href={`/user-management/user-body-metrics?userId=${userId}&date=${date ? format(date, 'yyyy-MM-dd') : ''}`} className="text-xs text-lightGray underline">See more</Link>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 w-full">
            {bodyMetrics && bodyMetrics.length > 0 ? (
              bodyMetrics.slice(0, 3).map((metric) => (
                <div key={metric.type} className="flex items-center border border-gray-200 rounded-[7px] px-2 py-2 bg-white w-full md:flex-1">
                  <img src={getMetricIcon(metric.type)} alt={metric.type} className="w-12 h-12 mr-3 object-contain" />
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-darkGray text-lg">{metric.value} {metric.unit}</span>
                    <span className="text-xs text-darkGray">{metric.type.charAt(0) + metric.type.slice(1).toLowerCase()}</span>
                  </div>
                  <span className="ml-2 flex items-center justify-center">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">No body metrics found for this date.</div>
            )}
          </div>
        </div>
        {/* Assigned Advisor */}
        <div className="flex flex-col gap-2 mt-4">
          <span className="font-adelle text-[17px] font-medium text-gray-800">Assigned advisor</span>
          <div className="flex items-center gap-4 mt-2">
            {user.advisorDetails ? (
              <>
                <span className="w-16 h-16 flex items-center justify-center rounded-[10px]">
                  <img src={ICONS.Advisor} alt="advisor" className="w-20 h-20 object-contain" />
                </span>
                <div className="flex flex-col">
                  <span className="font-bold text-darkGray text-lg">{user.advisorDetails.firstName} {user.advisorDetails.lastName}</span>
                  <span className="text-[17px] text-lightGray">Certified Nutritionist & Personal Trainer</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col">
                <span className="text-[17px] text-lightGray">No advisor assigned</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
