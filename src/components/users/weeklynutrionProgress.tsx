import React from 'react';

const nutritionData = [
  { day: 'Mon', protein: '20g', carb: '5g', vegies: '3g' },
  { day: 'Tue', protein: '120g', carb: '65g', vegies: '32g' },
  { day: 'Wed', protein: '120g', carb: '88g', vegies: '40g' },
  { day: 'Thu', protein: '125g', carb: '22g', vegies: '20g' },
  { day: 'Fri', protein: '130g', carb: '102g', vegies: '50g' },
  { day: 'Sat', protein: '-', carb: '-', vegies: '-' },
  { day: 'Sun', protein: '-', carb: '-', vegies: '-' },
];

const WeeklyNutritionProgress = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-[7px] p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="font-adelle text-[17px] font-semibold text-black">Weekly Nutrition Summary</span>
        <span className="text-[13px] text-gray-500 font-ceraPro">Plan: <span className="text-black">Portion control / Meal plan</span></span>
      </div>
      {/* Table for md and up */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full text-center border-separate border-spacing-0">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-left text-[15px] font-ceraPro font-medium text-gray-700 pl-2"></th>
              <th className="py-2 text-[15px] font-ceraPro font-medium text-gray-700">Protein</th>
              <th className="py-2 text-[15px] font-ceraPro font-medium text-gray-700">Carb</th>
              <th className="py-2 text-[15px] font-ceraPro font-medium text-gray-700">Vegies</th>
            </tr>
          </thead>
          <tbody>
            {nutritionData.map((row, idx) => (
              <tr key={idx}>
                <td className="py-3 text-left text-[15px] font-ceraPro font-semibold text-gray-700 pl-2">{row.day}</td>
                <td className="py-3">
                  <span className="inline-block min-w-[48px] bg-[#F5F5F5] rounded-[7px] py-1 text-[15px] font-ceraPro text-gray-800">{row.protein}</span>
                </td>
                <td className="py-3">
                  <span className="inline-block min-w-[48px] bg-[#F5F5F5] rounded-[7px] py-1 text-[15px] font-ceraPro text-gray-800">{row.carb}</span>
                </td>
                <td className="py-3">
                  <span className="inline-block min-w-[48px] bg-[#F5F5F5] rounded-[7px] py-1 text-[15px] font-ceraPro text-gray-800">{row.vegies}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Card/grid for small screens */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {nutritionData.map((row, idx) => (
          <div key={idx} className="flex flex-col bg-[#F5F5F5] rounded-[7px] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-ceraPro font-semibold text-gray-700 text-base">{row.day}</span>
            </div>
            <div className="flex justify-between text-[15px]">
              <span className="font-ceraPro text-gray-700">Protein: <span className="font-semibold text-gray-800">{row.protein}</span></span>
              <span className="font-ceraPro text-gray-700">Carb: <span className="font-semibold text-gray-800">{row.carb}</span></span>
              <span className="font-ceraPro text-gray-700">Vegies: <span className="font-semibold text-gray-800">{row.vegies}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyNutritionProgress;
