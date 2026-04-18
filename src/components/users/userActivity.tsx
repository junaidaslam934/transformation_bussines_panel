"use client";

import React, { useState, useEffect } from 'react';
import ICONS from '@/assets/icons';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
// import ArrowIcon from './ArrowIcon
import DrawerModal from '../DrawerModal';
import UserService from '@/services/userService';
import { useSearchParams, useParams } from 'next/navigation';
import { IDailyWorkoutDay, ICustomWorkout } from '@/types/api';

type Exercise = {
  key: string;
  title: string;
  image: string;
  setsReps: string;
  description: string;
};

interface CustomWorkoutData {
  workout: {
    _id: string;
    userId: string;
    description: string;
    workoutImage: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  surveys: {
    preWorkout: any;
    postWorkout: any;
  };
}

const UserActivity = () => {
  // Placeholder data
  const steps = 6867;
  const stepsGoal = 10000;
  const walkMinutes = 25;
  const walkGoal = 30
  const workoutProgress = 0.6; // 60% for progress bar
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isExerciseDrawerOpen, setIsExerciseDrawerOpen] = useState(false);
  const [isBuddyBoostOpen, setIsBuddyBoostOpen] = useState(false);
  const [isCustomWorkoutOpen, setIsCustomWorkoutOpen] = useState(false);
  const [customWorkoutData, setCustomWorkoutData] = useState<CustomWorkoutData | null>(null);
  const [dailyWorkouts, setDailyWorkouts] = useState<IDailyWorkoutDay[] | null>(null);
  const [customWorkouts, setCustomWorkouts] = useState<ICustomWorkout[] | null>(null);
  const searchParams = useSearchParams();
  const params = useParams();
  const workoutIdFromUrl = searchParams.get('workoutId');
  const userIdFromUrl = searchParams.get('userId') || (params as any)?.id || (params as any)?.userId || null;
  const [loading, setLoading] = useState(false);

  // Dynamic exercises placeholder mapped from daily workouts if available
  const exercises: Exercise[] = (dailyWorkouts && dailyWorkouts.length > 0)
    ? dailyWorkouts.slice(0, 2).map((dw, idx) => ({
        key: `${dw._id}-${idx}`,
        title: dw.workoutId?.title || `Workout ${idx + 1}`,
        image: dw.workoutId?.workoutImage || ICONS.activity2,
        setsReps: `${dw.week ? `Week ${dw.week}` : ''} ${dw.day ? `• ${dw.day}` : ''}`.trim(),
        description: dw.description || dw.workoutDescription || 'Workout session',
      }))
    : [
        {
          key: 'placeholder-1',
          title: 'Workout',
          image: ICONS.activity2,
          setsReps: '—',
          description: 'No workout details available',
        },
      ];
  // Fetch daily workouts using workoutId from URL
  useEffect(() => {
    const fetchDailyWorkouts = async () => {
      if (!workoutIdFromUrl) return;
      try {
        const response = await UserService.getDailyWorkouts(workoutIdFromUrl);
        if (response?.success && Array.isArray(response.data)) {
          setDailyWorkouts(response.data);
        } else if (Array.isArray((response as any))) {
          setDailyWorkouts(response as unknown as IDailyWorkoutDay[]);
        } else {
          setDailyWorkouts(null);
        }
      } catch (error) {
        setDailyWorkouts(null);
      }
    };
    fetchDailyWorkouts();
  }, [workoutIdFromUrl]);

  // Fetch custom workouts list on mount if userId is provided (from query or route params)
  useEffect(() => {
    console.log('userIdFromUrl', userIdFromUrl);
    const fetchCustomWorkouts = async () => {
      if (!userIdFromUrl) return;
      try {
        const list = await UserService.getCustomWorkoutsByUser(userIdFromUrl);
        if (list?.success && Array.isArray(list.data)) {
          setCustomWorkouts(list.data);
          if (list.data.length > 0) {
            const latest = [...list.data].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
            setCustomWorkoutData({
              workout: {
                _id: latest._id,
                userId: latest.userId,
                description: latest.description,
                workoutImage: latest.workoutImage,
                status: latest.status,
                createdAt: latest.createdAt,
                updatedAt: latest.updatedAt,
              },
              surveys: { preWorkout: null, postWorkout: null },
            });
          }
        } else {
          setCustomWorkouts(null);
        }
      } catch (error) {
        setCustomWorkouts(null);
      }
    };
    fetchCustomWorkouts();
  }, [userIdFromUrl]);

  // Fetch custom workout data when modal opens
  useEffect(() => {
    const fetchCustomWorkout = async () => {
      if (!isCustomWorkoutOpen) return;
      
      try {
        setLoading(true);
        if (userIdFromUrl) {
          const list = await UserService.getCustomWorkoutsByUser(userIdFromUrl);
          if (list?.success && Array.isArray(list.data) && list.data.length > 0) {
            // Use the most recent custom workout
            const latest = [...list.data].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
            setCustomWorkoutData({
              workout: {
                _id: latest._id,
                userId: latest.userId,
                description: latest.description,
                workoutImage: latest.workoutImage,
                status: latest.status,
                createdAt: latest.createdAt,
                updatedAt: latest.updatedAt,
              },
              surveys: { preWorkout: null, postWorkout: null },
            });
          } else {
            setCustomWorkoutData(null);
          }
          setCustomWorkouts(list?.data || null);
        }
      } catch (error) {
        console.error('Error fetching custom workout:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomWorkout();
  }, [isCustomWorkoutOpen, userIdFromUrl]);

  return (
    <div className="bg-white p-6  border border-[#eee] w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-adelle text-[17px] font-medium text-gray-800">Activity</span>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center  gap-2  text-gray-500 text-sm cursor-pointer select-none">
              <img src={ICONS.calederDate} alt="calendar" className="w-4 h-4" />
              <span className="font-ceraPro font-normal text-[16px] leading-[100%] tracking-[0] text-[#333]">{date ? format(date, "MMMM d, yyyy") : "Pick a date"}</span>
              <img src={ICONS.datepickerdropdowner} alt="dropdown" className="w-[13px] h-[7px]" />
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

      {/* Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Steps Counter */}
        <div className="bg-white border border-[#eee] rounded-[5px] flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center mb-2">
            <svg width="100" height="100" className="">
              <circle cx="50" cy="50" r="45" stroke="#eee" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="45" stroke="#222" strokeWidth="8" fill="none" strokeDasharray={2*Math.PI*45} strokeDashoffset={2*Math.PI*45*(1-steps/stepsGoal)} strokeLinecap="butt" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-gray-800">{steps}</span>
              <span className="text-xs text-gray-500 font-normal">Goal: 10k</span>
            </div>
          </div>
          <div className="font-semibold text-gray-800 text-lg mt-2">Steps Counter</div>
        </div>
        {/* Walk Timer */}
        <div className="bg-white border border-[#eee] rounded-[5px] flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center mb-2">
            <svg width="100" height="100" className="">
              <circle cx="50" cy="50" r="45" stroke="#eee" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="45" stroke="#222" strokeWidth="8" fill="none" strokeDasharray={2*Math.PI*45} strokeDashoffset={2*Math.PI*45*(1-walkMinutes/walkGoal)} strokeLinecap="butt" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-gray-800">{walkMinutes}m</span>
              <span className="text-xs text-gray-500 font-normal">Goal: 30m</span>
            </div>
          </div>
          <div className="font-semibold text-gray-800 text-lg mt-2">Walk timer</div>
        </div>
      </div>

      {/* Workout Plans */}
      <div className="mb-4 " >
        <div className="text-[16px] text-black font-normal font-adelle pt-4 pb-4">Workout plans</div>
        <div
          className="bg-white border border-[#eee] rounded-[7px] flex items-center p-3 gap-4 mb-2 cursor-pointer"
          onClick={() => setIsDrawerOpen(true)}
        >
          <img src={(dailyWorkouts && dailyWorkouts[0]?.workoutId?.workoutImage) || ICONS.activity1} alt="plan" className="w-20 h-20 rounded-md object-cover" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2 w-full">
              <div className="font-semibold text-gray-800 text-sm">{(dailyWorkouts && dailyWorkouts[0]?.workoutId?.title) || 'Workout plan'}</div>
              <img src={ICONS.ArrowGray} alt="arrow" className="w-9 h-9" />
            </div>
            <div className="text-[16px] text-[#333] font-light leading-[100%] tracking-[0] font-ceraPro mb-2 pt-4">{dailyWorkouts ? `Week ${dailyWorkouts[0]?.week} day ${dailyWorkouts[0]?.day}` : '—'}</div>
            <div className="relative flex items-center" style={{height: '32px', maxWidth: '8000px'}}>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-full">
                <div className="h-2 bg-black rounded-full" style={{width: `${workoutProgress*100}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Workouts */}
      <div>
        <div className="text-[16px] text-black font-normal font-adelle pt-3 pb-3 ">Other workouts</div>
        <div className="bg-white border border-[#eee] rounded-[7px] flex items-center p-3 gap-4 mb-2 cursor-pointer" onClick={() => setIsBuddyBoostOpen(true)}>
          <img src={ICONS.activity2} alt="Buddy Boost" className="w-12 h-12 rounded-md object-cover" />
          <div className="flex-1">
            <div className="font-medium text-gray-800 text-sm">Buddy Boost Workout</div>
          </div>
          <img src={ICONS.ArrowGray} alt="arrow" className="w-9 h-9" />
        </div>
        <div className="bg-white border border-[#eee] rounded-[7px] flex items-center p-3 gap-4 cursor-pointer" onClick={() => setIsCustomWorkoutOpen(true)}>
          <img src={ICONS.activity3} alt="Custom" className="w-12 h-12 rounded-md object-cover" />
          <div className="flex-1 ">
            <div className="font-medium text-gray-800 text-sm">Custom workout</div>
          </div>
          <img src={ICONS.ArrowGray} alt="arrow" className="w-9 h-9" />
        </div>
      </div>
      <DrawerModal open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Workout details">
        {/* Custom close button top-right */}
        <button
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-300 z-50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {/* Example content similar to the image */}
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center mb-0">
            <span className="font-adelle text-[24px] font-medium text-gray-800" >Workout details</span>
            <div className="flex items-center gap-6">
              <span className="flex items-center text-darkGray text-lg">Week 3 <img src={ICONS.datepickerdropdowner} alt="dropdown" className="w-3 h-3 ml-1" /></span>
              <span className="flex items-center text-darkGray text-lg">Day 5 <img src={ICONS.datepickerdropdowner} alt="dropdown" className="w-3 h-3 ml-1" /></span>
            </div>
          </div>
          <div className="border-b border-gray-200 mb-1 mt-0 w-full"  />
          <div className="border rounded-lg p-4 mb-2 bg-white">
            <div className="font-adelle text-[20px] font-bold text-gray-800 mb-1">Pre-Workout Check-In</div>
            <div className="text-[16px] text-lightGray mb-2">Quick survey about your workout motivation.</div>
            <div className="border-b border-gray-200 mb-3 w-full" />
            <ul className="space-y-3 mt-2 pl-2">
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span className="font-bold text-[17px] text-gray-800">Less than 1 hour ago</span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span><span className="font-bold text-[17px] text-gray-800">Excited</span> – <span className="text-[17px] text-darkGray font-normal">Ready to crush it</span></span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span><span className="font-bold text-[17px] text-gray-800">Yes</span> – <span className="text-[17px] text-darkGray font-normal">Fueled up and ready to go!</span></span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span><span className="font-bold text-[17px] text-gray-800">High</span> – <span className="text-[17px] text-darkGray font-normal">Fully energized and ready!</span></span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 mb-2 bg-white">
            <div className="font-adelle text-[20px] font-bold text-gray-800 mb-1">Strength & Endurance</div>
            <div className="text-lightGray">100 Push-Ups | 30 Sit-Ups</div>
            <div className="text-lightGray">Build upper body strength and core stability.</div>
            <div className="border-b border-gray-200 mb-3 w-full pt-3" />
            <div className="flex flex-col gap-3 mt-2">
              {/* Push-Ups Row */}
              <div className="flex items-center gap-3">
                <img src={ICONS.activity2} alt="Push-Ups" className="w-14 h-14 rounded object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[17px] text-gray-800">Push-Ups</span>
                    <img src={ICONS.crossers} alt="arrowbar" className="w-5 h-5" />
                  </div>
                  <div className="text-[15px] text-gray-700">4 sets × 25 reps</div>
                </div>
                <img src={ICONS.walker} alt="walker" className="w-14 h-14 opacity-40" />
              </div>
              {/* Sit-ups Row */}
              <div className="flex items-center gap-3">
                <img src={ICONS.activity3} alt="Sit-ups" className="w-14 h-14 rounded object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[17px] text-gray-800">Sit-ups</span>
                  </div>
                  <div className="text-[15px] text-gray-700">3 sets × 10 reps</div>
                </div>
                <img src={ICONS.walker} alt="walker" className="w-14 h-14 opacity-40" /> 
              </div>
            </div>
            <button className="w-full mt-5 py-2 border border-gray-800 text-gray-900 rounded-[7px] flex items-center justify-center gap-2 text-base font-semibold bg-white"><img src={ICONS.done} alt="done" className="w-6 h-6" /> Completed</button>
          </div>
          <div className="border rounded-lg p-4 bg-white">
            <div className="font-adelle text-[20px] font-bold text-gray-800 mb-1">Post-Workout Check-In</div>
            <div className="text-lightGray mb-2">Quick survey about how your workout goes.</div>
            <div className="border-b border-gray-200 mb-3 w-full" />
            <ul className="space-y-3 mt-2 pl-2">
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span>
                  <span className="font-bold text-[17px] text-gray-800">Yes</span>
                  <span className="text-[17px] text-darkGray font-normal"> – Refueling for recovery.</span>
                </span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span>
                  <span className="font-bold text-[17px] text-gray-800">Good</span>
                  <span className="text-[17px] text-darkGray font-normal"> – Feeling strong and accomplished.</span>
                </span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span>
                  <span className="font-bold text-[17px] text-gray-800">Moderate</span>
                  <span className="text-[17px] text-darkGray font-normal"> – A bit tired but good.</span>
                </span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </DrawerModal>

      {/* Buddy Boost Modal */}
      <DrawerModal open={isBuddyBoostOpen} onClose={() => setIsBuddyBoostOpen(false)} title="Workout details">
        {/* Custom close button top-right */}
        <button
          onClick={() => setIsBuddyBoostOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-300 z-50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center mb-0">
            <span className="font-adelle text-[24px] font-medium text-gray-800" >Workout details</span>
            {/* <span className="text-gray-500 text-sm">Buddy Boost</span> */}
          </div>
          <div className="border-b border-gray-200 mb-0 mt-0 w-full"  />
          {/* Pre-Workout Check-In */}
          <div className="border rounded-lg p-4 mb-2 bg-white">
            <div className="font-adelle text-[20px] font-bold text-gray-800 mb-1">Pre-Workout Check-In</div>
            <div className="text-[16px] text-lightGray mb-2">Quick survey about your workout motivation.</div>
            <div className="border-b border-gray-200 mb-3 w-full" />
            <ul className="space-y-3 mt-2 pl-2">
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span className="font-bold text-[17px] text-gray-800">Less than 1 hour ago</span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span><span className="font-bold text-[17px] text-gray-800">Excited</span> – <span className="text-[17px] text-darkGray font-normal">Ready to crush it</span></span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span><span className="font-bold text-[17px] text-gray-800">Yes</span> – <span className="text-[17px] text-darkGray font-normal">Fueled up and ready to go!</span></span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span><span className="font-bold text-[17px] text-gray-800">High</span> – <span className="text-[17px] text-darkGray font-normal">Fully energized and ready!</span></span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
            </ul>
          </div>
          {/* Middle section: Large image and description */}
          <div className="w-full  p-4 rounded-[10px] border border-gray-300 flex flex-col items-center">
            <div className="w-full rounded-t-[7px] overflow-hidden aspect-[16/9] bg-gray-200">
              <img src={ICONS.activity2} alt="Buddy Boost" className="w-full h-full object-cover" />
            </div>
            <div className="w-full p-4 text-[15px] text-gray-500 font-ceraPro">
              Join your buddy for a high-energy partner workout! This session includes synchronized exercises, partner resistance drills, and a fun competitive finisher. Get ready to push each other and have a blast!
            </div>
            <button className="w-full mt-0 py-2 border border-gray-800 text-gray-900 rounded-[7px] flex items-center justify-center gap-2 text-base font-semibold bg-white"><img src={ICONS.done} alt="done" className="w-6 h-6" /> Completed</button>
          </div>
          {/* Post-Workout Check-In */}
          <div className="border rounded-lg p-4 bg-white">
            <div className="font-adelle text-[20px] font-bold text-gray-800 mb-1">Post-Workout Check-In</div>
            <div className="text-lightGray mb-2">Quick survey about how your workout goes.</div>
            <div className="border-b border-gray-200 mb-3 w-full" />
            <ul className="space-y-3 mt-2 pl-2">
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span>
                  <span className="font-bold text-[17px] text-gray-800">Yes</span>
                  <span className="text-[17px] text-darkGray font-normal"> – Refueling for recovery.</span>
                </span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span>
                  <span className="font-bold text-[17px] text-gray-800">Good</span>
                  <span className="text-[17px] text-darkGray font-normal"> – Feeling strong and accomplished.</span>
                </span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
              <li className="flex items-start before:content-['•'] before:mr-3 before:text-black">
                <span>
                  <span className="font-bold text-[17px] text-gray-800">Moderate</span>
                  <span className="text-[17px] text-darkGray font-normal"> – A bit tired but good.</span>
                </span>
                <span className="ml-auto flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="opacity-40"><circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="2"/><path d="M10 14v-1.2c0-.6.4-1.1 1-1.4.9-.4 1.5-1.2 1.5-2.1 0-1.3-1.1-2.3-2.5-2.3s-2.5 1-2.5 2.3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="16" r="1" fill="#888"/></svg>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </DrawerModal>

      {/* Custom Workout Modal */}
      <DrawerModal open={isCustomWorkoutOpen} onClose={() => setIsCustomWorkoutOpen(false)} title="Workout details">
        {/* Custom close button top-right */}
        <button
          onClick={() => setIsCustomWorkoutOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-300 z-50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center mb-0">
            <span className="font-adelle text-[24px] font-medium text-gray-800" >Workout details</span>
            <span className="text-gray-500 text-sm">Custom workout</span>
          </div>
          <div className="border-b border-gray-200 mb-0 mt-0 w-full"  />
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading workout details...</p>
            </div>
          ) : customWorkoutData ? (
            <>
              {/* Pre-Workout Check-In */}
              <div className="border rounded-lg p-4 mb-2 bg-white">
                <div className="font-adelle text-[20px] font-bold text-gray-800 mb-1">Pre-Workout Check-In</div>
                <div className="text-[16px] text-lightGray mb-2">Quick survey about your workout motivation.</div>
                <div className="border-b border-gray-200 mb-3 w-full" />
                {customWorkoutData.surveys.preWorkout ? (
                  <div className="text-gray-600">Pre-workout survey data available</div>
                ) : (
                  <div className="text-gray-400 italic">No pre-workout survey completed</div>
                )}
              </div>
              
              {/* Middle section: Workout details */}
              <div className="w-full p-4 rounded-[10px] border border-gray-300 flex flex-col items-center">
                <div className="w-full rounded-t-[7px] overflow-hidden aspect-[16/9] bg-gray-200">
                  {customWorkoutData.workout.workoutImage ? (
                    <img src={customWorkoutData.workout.workoutImage} alt="Custom workout" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <img src={ICONS.activity3} alt="Custom workout" className="w-16 h-16 opacity-50" />
                    </div>
                  )}
                </div>
                <div className="w-full p-4 text-[15px] text-gray-500 font-ceraPro">
                  {customWorkoutData.workout.description || "Custom workout description"}
                </div>
                <div className="w-full flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Status: <span className={`font-semibold ${customWorkoutData.workout.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>
                    {customWorkoutData.workout.status}
                  </span></span>
                  <span>Created: {new Date(customWorkoutData.workout.createdAt).toLocaleDateString()}</span>
                </div>
                <button className="w-full mt-0 py-2 border border-gray-800 text-gray-900 rounded-[7px] flex items-center justify-center gap-2 text-base font-semibold bg-white">
                  <img src={ICONS.done} alt="done" className="w-6 h-6" /> 
                  {customWorkoutData.workout.status === 'COMPLETED' ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
              
              {/* Post-Workout Check-In */}
              <div className="border rounded-lg p-4 bg-white">
                <div className="font-adelle text-[20px] font-bold text-gray-800 mb-1">Post-Workout Check-In</div>
                <div className="text-lightGray mb-2">Quick survey about how your workout goes.</div>
                <div className="border-b border-gray-200 mb-3 w-full" />
                {customWorkoutData.surveys.postWorkout ? (
                  <div className="text-gray-600">Post-workout survey data available</div>
                ) : (
                  <div className="text-gray-400 italic">No post-workout survey completed</div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Failed to load workout details
            </div>
          )}
        </div>
      </DrawerModal>
    </div>
  );
};

export default UserActivity;
