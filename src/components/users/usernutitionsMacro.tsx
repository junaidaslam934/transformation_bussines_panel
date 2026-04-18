"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ICONS from "@/assets/icons";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface UserNutritionsMacroProps {
  userId?: string;
}

const DEFAULT_GOALS = {
  calories: 2500,
  protein: 150,
  carbs: 300,
  fats: 70,
  fiber: 40,
  waterLiters: 8,
};

const meals = [         
  {
    title: "Meal 1",
    calories: 418,
    protein: 70,
    carbs: 125,
    fats: 32,
    fiber: 8,
    foods: "Meals",
  },
  {
    title: "Meal 2",
    calories: 1150,
    protein: 52,
    carbs: 72,
    fats: 38,
    fiber: 16,
    foods: "Foods",
  },
  {
    title: "Meal 3",
    calories: 1150,
    protein: 52,
    carbs: 72,
    fats: 38,
    fiber: 16,
    foods: "Foods",
  },
  {
    title: "Meal 4",
    calories: 1150,
    protein: 52,
    carbs: 72,
    fats: 38,
    fiber: 16,
    foods: "Foods",
  },
];

const supplements = [
  "Zinc",
  "Coenzyme Q10",
  "Vitamin D3",
];

type Food = {
  icon: string;
  name: string;
  macros: { cal: number; p: number; c: number; f: number; fi: number } | null;
};

const mealFoods: { [key: string]: Food[] } = {
  "Meal 1": [
    {
      icon: ICONS.pizza,
      name: "Pizza (Recipe)",
      macros: { cal: 650, p: 12, c: 12, f: 22, fi: 50 }
    },
    {
      icon: ICONS.burger1,
      name: "Burger",
      macros: { cal: 650, p: 30, c: 45, f: 40, fi: 20 }
    },
    {
      icon: ICONS.salad,
      name: "Salad",
      macros: { cal: 650, p: 10, c: 15, f: 10, fi: 55 }
    },
    {
      icon: ICONS.capsule,
      name: "Vitamin D3",
      macros: null
    }
  ],
  "Meal 2": [
    {
      icon: ICONS.pizza,
      name: "Pizza (Recipe)",
      macros: { cal: 650, p: 12, c: 12, f: 22, fi: 50 }
    },
    {
      icon: ICONS.burger1,
      name: "Burger",
      macros: { cal: 650, p: 30, c: 45, f: 40, fi: 20 }
    },
    {
      icon: ICONS.salad,
      name: "Salad",
      macros: { cal: 650, p: 10, c: 15, f: 10, fi: 55 }
    },
    {
      icon: ICONS.capsule,
      name: "Vitamin D3",
      macros: null
    }
  ],
  "Meal 3": [
    {
      icon: ICONS.pizza,
      name: "Pizza (Recipe)",
      macros: { cal: 650, p: 12, c: 12, f: 22, fi: 50 }
    },
    {
      icon: ICONS.burger1,
      name: "Burger",
      macros: { cal: 650, p: 30, c: 45, f: 40, fi: 20 }
    },
    {
      icon: ICONS.salad,
      name: "Salad",
      macros: { cal: 650, p: 10, c: 15, f: 10, fi: 55 }
    },
    {
      icon: ICONS.capsule,
      name: "Vitamin D3",
      macros: null
    }
  ],
  "Meal 4": [
    {
      icon: ICONS.pizza,
      name: "Pizza (Recipe)",
      macros: { cal: 650, p: 12, c: 12, f: 22, fi: 50 }
    },
    {
      icon: ICONS.burger1,
      name: "Burger",
      macros: { cal: 650, p: 30, c: 45, f: 40, fi: 20 }
    },
    {
      icon: ICONS.salad,
      name: "Salad",
      macros: { cal: 650, p: 10, c: 15, f: 10, fi: 55 }
    },
    {
      icon: ICONS.capsule,
      name: "Vitamin D3",
      macros: null
    }
  ]
};

const UserNutritionsMacro = ({ userId }: UserNutritionsMacroProps) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openSupplements, setOpenSupplements] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  });
  const [waterInTake, setWaterInTake] = useState<number>(0);
  const [mealsFromApi, setMealsFromApi] = useState<Array<{
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    foods: string;
  }>>([]);

  // Fetch nutrition totals for user and date
  useEffect(() => {
    const fetchNutritions = async () => {
      if (!userId || !date) return;
      try {
        setLoading(true);
        setError(null);
        const formattedDate = format(date, "yyyy-MM-dd");
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL_TEST ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1";

        const cookies = document.cookie.split(";");
        const accessTokenCookie = cookies.find((c) => c.trim().startsWith("accessToken="));
        const cookieToken = accessTokenCookie ? accessTokenCookie.split("=")[1] : "";
        const lsToken = (() => {
          try {
            const storedUser = localStorage.getItem("user-storage");
            if (!storedUser) return "";
            const userData = JSON.parse(storedUser);
            return userData.state?.idToken || "";
          } catch {
            return "";
          }
        })();
        const authToken = localStorage.getItem("authToken") || cookieToken || lsToken || "";

        // Actual endpoint: /nutritions/get-nutrition-all-data?date=YYYY-MM-DD&createdBy={userId}
        const url = `${baseUrl}/nutritions/get-nutrition-all-data?date=${encodeURIComponent(
          formattedDate
        )}&createdBy=${encodeURIComponent(userId)}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken ? `Bearer ${authToken}` : "",
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const json = await res.json();
        const first = Array.isArray(json?.data)
          ? (json.data.length > 0 ? json.data[0] : null)
          : (json?.data || null);
        if (first) {
          setWaterInTake(first.waterInTake || 0);
          setTotals({
            calories: first.totalCalories || 0,
            protein: first.totalProteins || 0,
            carbs: first.totalCarbs || 0,
            fats: first.totalFats || 0,
            fiber: first.totalFiber || 0,
          });
          if (Array.isArray(first.macroMeals) && first.macroMeals.length > 0) {
            const mapped = first.macroMeals.map((m: any) => ({
              title: typeof m.mealName === 'string' ? m.mealName.replace(/Meal(\d+)/, 'Meal $1') : 'Meal',
              calories: m.totalCalories || 0,
              protein: m.totalProteins || 0,
              carbs: m.totalCarbs || 0,
              fats: m.totalFats || 0,
              fiber: m.totalFiber || 0,
              foods: 'Foods',
            }));
            setMealsFromApi(mapped);
          } else {
            setMealsFromApi([]);
          }
        } else {
          setWaterInTake(0);
          setTotals({ calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
          setMealsFromApi([]);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to fetch nutritions");
      } finally {
        setLoading(false);
      }
    };

    fetchNutritions();
  }, [userId, date]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openDropdown !== null) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 dow-md w-full">
      {/* Header */}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div>
          <h2 className="font-adelle text-[17px] font-normal text-black">Nutrition <span className="font-ceraPro text-lightGray text-[15px] font-normal">(Calories/ Macro tracking)</span></h2>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-2 text-lightGray text-sm cursor-pointer select-none">
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

      {/* Macro summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pt-4">
        {[
          { label: "Calories", value: totals.calories, goal: DEFAULT_GOALS.calories, color: "bg-yellow-500" },
          { label: "Protein (g)", value: totals.protein, goal: DEFAULT_GOALS.protein, color: "bg-green-500" },
          { label: "Carbs (g)", value: totals.carbs, goal: DEFAULT_GOALS.carbs, color: "bg-red-500" },
          { label: "Fats (g)", value: totals.fats, goal: DEFAULT_GOALS.fats, color: "bg-red-500" },
        ].map((macro, idx) => (
          <div key={macro.label} className="bg-white rounded-[7px]  p-4 flex flex-row items-center border border-gray-200">
            <div className="flex flex-col flex-1 space-y-1">
              <span className="font-ceraPro font-normal text-[16px] leading-[100%] tracking-[0] text-lightGray text-[15px] ">{macro.label}</span>
              <span className="font-adelle text-[32px] font-light text-darkGray">{macro.value}</span>
              <span className="font-ceraPro font-normal text-[16px] leading-[100%] tracking-[0] text-darkGray">Goal: {macro.goal}</span>
            </div>
            <div className="flex items-center h-full ml-4">
              <Progress
                value={Math.min((macro.value / macro.goal) * 100, 100)}
                className="w-2 h-24 bg-gray-100 rounded-full relative overflow-hidden"
                indicatorClassName={`${macro.color} absolute bottom-0 left-0 w-full rounded-full`}
                indicatorStyle={{
                  height: `${Math.min((macro.value / macro.goal) * 100, 100)}%`,
                  width: "100%",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  transform: "none"
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Water and Fiber tracker - responsive: stacked on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row items-stretch w-full mb-4 gap-4">
        {/* Water Bar */}
        <div className="flex items-center bg-[#54B8FF] rounded-l-[5px] h-16 px-6 w-full md:w-auto md:min-w-[220px]">
          <img src={ICONS.watermark} alt="Water" className="w-8 h-8 mr-3" />
          <span className="text-white text-2xl font-bold">{waterInTake}L</span>
          <span className="text-white text-base font-semibold">/{DEFAULT_GOALS.waterLiters}L</span>
        </div>
        {/* White fill bar */}
        <div className="flex-1 h-16 bg-white border-t border-b border-r border-gray-200 rounded-r-lg" />
        {/* Fiber Box */}
        <div className="flex flex-col justify-center items-center h-16 px-6 bg-white border border-gray-200 rounded-[7px] min-w-[110px] md:ml-2 ml-0 mt-4 md:mt-0">
          <span className="text-lightGray text-sm">Fiber (g)</span>
          <span className="text-2xl  font-bold text-gray-900">{totals.fiber}<span className="text-lg font-bold text-gray-900">/{DEFAULT_GOALS.fiber}</span></span>
        </div>
      </div>
      {/* Arrow box below water/fiber tracker */}
      {/* <div className="w-full border rounded-lg h-16 flex items-center justify-center mb-6">
        <ArrowRight size={32} className="text-gray-700" />
      </div> */}

      {/* Meals and supplements: two cards per row, each row in its own wrapper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ...((mealsFromApi.length > 0 ? mealsFromApi : meals).map((meal, idx) => (
          <div
            key={meal.title}
              className={`relative w-full mb-4 p-4 flex flex-col gap-4 transition-all duration-200 bg-white ${openDropdown === idx ? 'shadow-lg border-0 rounded-t-[7px]' : 'border border-gray-200 rounded-[7px]'}`}
            ref={el => { dropdownRefs.current[idx] = el; }}
              style={{ boxSizing: 'border-box' }}
          >
            {/* Title */}
            <div className="font-adelle text-[16px] font-normal text-black mb-2">{meal.title}</div>
            {/* Macro boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-2 w-full">
              {[{
                value: meal.calories, label: "Calories"
              }, {
                value: meal.protein, label: "Protein"
              }, {
                value: meal.carbs, label: "Carbs"
              }, {
                value: meal.fats, label: "Fats"
              }, {
                value: meal.fiber, label: "Fiber"
              }].map((macro) => (
                <div key={macro.label} className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl min-w-0 w-full h-16 sm:h-20">
                  <span className="font-ceraPro font-semibold text-base sm:text-lg text-darkGray text-center">{macro.value}</span>
                  <span className="font-ceraPro text-xs sm:text-sm text-lightGray font-normal text-center">{macro.label}</span>
                </div>
              ))}
            </div>
            {/* Dropdown row */}
            <div
              className="flex items-center justify-between w-full mt-2 cursor-pointer select-none"
              onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
            >
              <span className="text-base text-lightGray">{meal.foods}</span>
              <img
                src={ICONS.datepickerdropdowner}
                alt="dropdown"
                className={`w-[13px] h-[7px] transition-transform duration-200 ${openDropdown === idx ? 'rotate-0' : 'rotate-180'}`}
              />
            </div>
            {/* Dropdown content ... */}
            {openDropdown === idx && (
                <div className="absolute left-0 right-0 top-full z-30 bg-white rounded-b-[7px] shadow-lg p-4" style={{ minWidth: '100%' }}>
                <div className="flex flex-col gap-4">
                  {(mealFoods[meal.title] || []).map((food: Food, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-md">
                          <img src={food.icon} alt={food.name} className="w-8 h-8 " />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-gray-800 text-base font-medium ">{food.name}</span>
                          {food.macros ? (
                            <span className="font-ceraPro font-normal text-[14px] leading-[100%] tracking-[0] text-lightGray flex items-center gap-1 mt-1">
                              {food.macros.cal} Cal
                              <span className="mx-1 text-lightGray">|</span>
                              {food.macros.p}P
                              <span className="mx-1 text-lightGray">|</span>
                              {food.macros.c}
                              <span className="mx-1 text-lightGray">|</span>
                              {food.macros.f}Fa
                              <span className="mx-1 text-lightGray">|</span>
                              {food.macros.fi}Fi
                            </span>
                          ) : null}
                        </div>
                      </div>
                      {/* Removed MoreVertical icon */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          ))),
          <div key="supplements" className="relative w-full mb-4 bg-white border border-gray-200 rounded-[7px] p-4 flex flex-col gap-4" style={{ boxSizing: 'border-box' }}>
            <div
              className="flex items-center justify-between w-full cursor-pointer select-none"
              onClick={() => setOpenSupplements((prev) => !prev)}
            >
              <span className="font-adelle text-[16px] font-normal text-black mb-2">Supplement & products</span>
              <img
                src={ICONS.datepickerdropdowner}
                alt="dropdown"
                className={`w-[13px] h-[7px] transition-transform duration-200 ${openSupplements ? 'rotate-0' : 'rotate-180'}`}
              />
            </div>
            {openSupplements && (
              <div className="w-full rounded-b-[7px] p-0 m-0">
          {supplements.map((supp, idx) => (
            <div key={supp} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-md">
                  <img src={ICONS.capsule} alt="Capsule" className="w-6 h-6" />
                </span>
                <span className="text-gray-800 text-base font-medium">{supp}</span>
              </div>
            </div>
          ))}
        </div>
            )}
          </div>
        ].map((card, idx) => card)}
      </div>

      {/* Remove old supplements section below grid */}

    </div>
  );
};

export default UserNutritionsMacro;
 