"use client"
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import ICONS from '@/assets/icons';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import WorkoutService from '@/services/workoutService';
import { IWorkout, IWorkoutsResponse } from '@/types/api';
import { useRouter } from 'next/navigation';

export default function WorkoutContent() {
  const router = useRouter();
  const [tab, setTab] = useState("Workouts");
  const [level, setLevel] = useState("BEGINNER");
  const [search, setSearch] = useState("");
  const [workouts, setWorkouts] = useState<IWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await WorkoutService.getWorkouts(level, 10, search.trim() || undefined);
      
      if (response.success) {
        setWorkouts(response.data);
      } else {
        setError('Failed to fetch workouts');
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or when level/search changes
  useEffect(() => {
    fetchWorkouts();
  }, [level, search]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchWorkouts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="p-8 w-full min-h-screen bg-white">
        <span className="font-adelle text-[17px] font-medium text-gray-800 pb-6">Content Management</span>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 mt-7">
        <button
          className={`px-4 py-2 rounded-[7px] border-lightGray text-base font-medium ${tab === "Nutrition" ? "bg-lightBrown border-gray-200 text-black" : "bg-[#FAF9F6] border-transparent text-gray-700"}`}
          onClick={() => setTab("Nutrition")}
        >
          Nutrition
        </button>
        <button
          className={`px-4 py-2 rounded-[7px] border-lightGray text-base font-medium ${tab === "Workouts" ? "bg-lightBrown border-lightGray text-black" : "bg-[#FAF9F6] border-lightGray text-gray-700"}`}
          onClick={() => setTab("Workouts")}
        >
          Workouts
        </button>
      </div>
      {/* Controls */}
      <div className="flex items-center mb-8 justify-between gap-4 w-full">
        {/* Filter on the left */}
        <div className="w-full max-w-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-[7px] bg-white text-darkgray font-semibold text-base shadow-sm focus:outline-none">
                {level}
                <ChevronDown className="w-5 h-5 text-darkgray" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[var(--radix-dropdown-menu-trigger-width)] p-0 bg-white rounded-xl shadow-lg">
              <ul className="py-2">
                {["BEGINNER", "INTERMEDIATE", "EXPERT"].map((item) => (
                  <DropdownMenuItem asChild key={item}>
                    <li
                      onClick={() => setLevel(item)}
                      className={`px-5 py-3 cursor-pointer
                        ${level === item ? "font-bold text-black" : "font-normal text-gray-700"}
                        hover:bg-gray-100 rounded-lg transition`}
                    >
                      {item}
                    </li>
                  </DropdownMenuItem>
                ))}
              </ul>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Search bar and + button on the right */}
        <div className="flex items-center gap-4 w-full max-w-lg justify-end">
          <div className="relative w-full max-w-sm"> {/* Match filter width */}
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-[7px] bg-white text-gray-700 focus:outline-none pr-10" // Match filter height and radius
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search className="w-5 h-5" />
            </span>
          </div>
          <button 
            className="w-20 h-12 flex items-center justify-center rounded-[5px] bg-lightBrown text-black text-2xl font-bold hover:bg-[#f5e0c7] transition-colors"
            onClick={() => router.push('/content-management/addworkout')}
          >
            +
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          <span className="ml-3 text-gray-600">Loading workouts...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
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
      )}

      {/* Cards Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  {search ? `No workouts found matching "${search}"` : `No workouts available for ${level} level`}
                </p>
              </div>
            </div>
          ) : (
            workouts.map((workout, i) => (
              <div key={workout._id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col min-h-[210px]">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={workout.workoutImage || "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=400"} 
                    alt={workout.title} 
                    className="w-16 h-16 object-cover rounded-[5px]" 
                  />
                  <div>
                    <div className="font-bold text-base text-black mb-1">{workout.title}</div>
                    <div className="text-xs text-darkGray font-medium">{workout.tagLine}</div>
                  </div>
                </div>
                <div className="border-t border-gray-lightGraty mb-3"></div>
                <div className="mb-1">
                  <span className="text-darkGray">Focus Areas: </span>
                  <span className="text-darkGray">{workout.focusArea}</span>
                </div>
                <div className="mb-4">
                  <span className="text-darkGary">Equipment: </span>
                  <span className="text-darkGray">{workout.equipment}</span>
                </div>
                <div className="mb-2">
                  <span className="text-darkGray">Duration: </span>
                  <span className="text-darkGray">{workout.durationInWeeks} weeks</span>
                </div>
                <button 
                  className="mt-auto border border-darkGray rounded-[5px] py-2 flex items-center justify-center text-lg font-bold text-black hover:bg-gray-100 transition"
                  onClick={async () => {
                    try {
                      const targetWeek = workout.durationInWeeks || 1;
                      // Fetch daily workouts for this workout for the target week
                      const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/daily-workouts?workoutId=${workout._id}&week=${targetWeek}`,
                        {
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
                          },
                        }
                      );
                      
                      if (response.ok) {
                        const data = await response.json();
                        // Navigate to workout details with workout data
                        router.push(`/content-management/workoutdetails?workoutId=${workout._id}&week=${targetWeek}`);
                      } else {
                        console.error('Failed to fetch daily workouts');
                        // Still navigate even if API fails
                        router.push(`/content-management/workoutdetails?workoutId=${workout._id}&week=${targetWeek}`);
                      }
                    } catch (error) {
                      console.error('Error fetching daily workouts:', error);
                      // Navigate even if there's an error
                      router.push(`/content-management/workoutdetails?workoutId=${workout._id}&week=${workout.durationInWeeks || 1}`);
                    }
                  }}
                >
                  <img src={ICONS.arrowhead} alt="arrow" className="w-6 h-6" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}