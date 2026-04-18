"use client";
import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import ICONS from "@/assets/icons"; // adjust path as needed
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const meal1Foods = [
  { icon: ICONS.legChicken, name: "Chicken Breast", amount: "(200g)", checked: true },
  { icon: ICONS.vaggeis, name: "Broccoli", amount: "(100g)", checked: false },
  { icon: ICONS.carbs, name: "Rice", amount: "(150g)", checked: false },
];
const meal2Foods = [
  { icon: ICONS.legChicken, name: "Turkey Mince", amount: "(180g)", checked: true },
  { icon: ICONS.vaggeis, name: "Spinach", amount: "(80g)", checked: false },
  { icon: ICONS.carbs, name: "Quinoa", amount: "(120g)", checked: false },
];
const meal3Foods = [
  { icon: ICONS.legChicken, name: "Salmon", amount: "(150g)", checked: true },
  { icon: ICONS.vaggeis, name: "Asparagus", amount: "(90g)", checked: false },
  { icon: ICONS.carbs, name: "Sweet Potato", amount: "(130g)", checked: false },
];
const meal4Foods = [
  { icon: ICONS.legChicken, name: "Eggs", amount: "(3 pcs)", checked: true },
  { icon: ICONS.vaggeis, name: "Tomato", amount: "(70g)", checked: false },
  { icon: ICONS.carbs, name: "Oats", amount: "(100g)", checked: false },
];
const meal5Foods = [
  { icon: ICONS.legChicken, name: "Paneer", amount: "(120g)", checked: true },
  { icon: ICONS.vaggeis, name: "Peas", amount: "(60g)", checked: false },
  { icon: ICONS.carbs, name: "Bread", amount: "(2 slices)", checked: false },
];

const supplements = [
  { name: "Zinc", icon: ICONS.capsule },
  { name: "Coenzyme Q10", icon: ICONS.capsule },
  { name: "Vitamin D3", icon: ICONS.capsule },
];

export default function UserNutritionFood() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [openMeals, setOpenMeals] = useState<{ [key: number]: boolean }>({});
  const [openSupplements, setOpenSupplements] = useState(false);
  

  const meals = [
    { id: 1, title: 'Meal 1', foods: meal1Foods },
    { id: 2, title: 'Meal 2', foods: meal2Foods },
    { id: 3, title: 'Meal 3', foods: meal3Foods },
    { id: 4, title: 'Meal 4', foods: meal4Foods },
    { id: 5, title: 'Meal 5', foods: meal5Foods },
  ];

  return (
    <div className="p-4 bg-white  min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
       
        <h2 className="font-adelle text-[17px] font-normal text-black">Nutrition <span className="font-ceraPro text-lightGray text-[15px] font-normal">(Calories/ Macro tracking)</span></h2>
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

      {/* Meal Progress Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4 pt-6">
        {[1,2,3,4,5].map((n, i) => (
          <div key={n} className="bg-white rounded-[5px] border border-gray-200 flex flex-col items-center  py-8">
            <span className="text-lightGray text-base ml-2">Meal {n}</span>
            <div className="relative w-14 h-14 flex items-center justify-center mb-1">
              {/* Replace with a circular progress component if you have one */}
              <svg className="w-14 h-14" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                {n === 1 && (
                  <circle
                    cx="28" cy="28" r="24"
                    fill="none"
                    stroke="#222"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - 2/3)}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-darkGray">
                {n === 1 ? (
                  <>
                    2<span className="text-base font-normal text-lightGray">/3</span>
                  </>
                ) : (
                  <>
                    0<span className="text-base font-normal text-lightGray">/3</span>
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Water Tracker */}
      <div className="flex items-center mb-4">
      <div className="flex items-center bg-blue-400 h-14 px-16 min-w-[120px] rounded-l-[5px]">
              <img src={ICONS.watermark} alt="Water" className="w-6 h-6 mr-2" />
              <span className="text-white text-lg font-bold">1L</span>
              <span className="text-white text-base font-semibold">/8L</span>
            </div>
        <div className="flex-1 h-14 bg-white border-t border-b border-r border-gray-200 rounded-r-lg" />
        
      </div>

      {/* Render two cards per row, each in its own flex row container */}
      {(() => {
        const allCards = [
          ...meals.map(meal => (
            <div key={meal.id} className="flex-1">
              <div className="bg-white border border-gray-200 rounded-[7px] mb-2 shadow-sm">
                <div className="flex justify-between items-center px-4 py-4 select-none cursor-pointer" onClick={() => setOpenMeals(prev => ({ ...prev, [meal.id]: !prev[meal.id] }))}>
                  <span className="font-adelle text-[17px] font-medium text-gray-800">{meal.title}</span>
                  <img
                    src={ICONS.datepickerdropdowner}
                    alt="dropdown"
                    className={`w-3 h-3 transition-transform duration-200 ${openMeals[meal.id] ? 'rotate-180' : ''}`}
                  />
                </div>
                {openMeals[meal.id] && (
                  <div className="px-4 pb-2">
                    {meal.foods.map((food, i) => (
                      <div key={i} className="flex items-center justify-between bg-white rounded px-2 py-1 mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-[5px]">
                            <img src={food.icon} alt="" className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex flex-col">
                              <span className="text-gray-800 text-sm">{food.name}</span>
                              {food.amount && (
                                <span className="text-xs text-gray-800">{food.amount}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {food.checked ? (
                          <img src={ICONS.rightcheck} alt="Checked" className="w-5 h-5" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )),
          <div key="supplements" className="flex-1">
            <div className="bg-white border border-gray-200 rounded-[7px] mb-2 shadow-sm">
              <div className="flex justify-between items-center px-4 py-4 select-none cursor-pointer" onClick={() => setOpenSupplements(prev => !prev)}>
                <span className="font-adelle text-[17px] font-medium text-gray-800">Supplement & products</span>
                <img
                  src={ICONS.datepickerdropdowner}
                  alt="dropdown"
                  className={`w-3 h-3 transition-transform duration-200 ${openSupplements ? 'rotate-180' : ''}`}
                />
              </div>
              {openSupplements && (
                <div className="p-4 flex flex-col gap-2">
                  {supplements.map((supp, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-[5px]">
                        <img src={supp.icon} alt="" className="w-7 h-7" />
                      </div>
                      <span className="text-gray-800 text-base font-medium">{supp.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ];
        const rows = [];
        for (let i = 0; i < allCards.length; i += 2) {
          rows.push(
            <div key={i} className="flex flex-col md:flex-row gap-4 mb-4">
              {allCards.slice(i, i + 2)}
            </div>
          );
        }
        return rows;
      })()}
        
      </div>

  );
}
