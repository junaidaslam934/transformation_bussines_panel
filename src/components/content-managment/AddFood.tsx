"use client"


import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import ICONS from '@/assets/icons';

const AddFood = () => {
  const [image, setImage] = useState<File | null>(null);
  const [food, setFood] = useState({
    name: '',
    calories: '',
    protein: '',
    fat: '',
    carbs: '',
    fiber: '',
  });
  const [portion, setPortion] = useState({ label: '', grams: '', oz: '' });
  const [portions, setPortions] = useState<Array<{ label: string; grams: string; oz: string }>>([
   
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handlePortionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPortion({ ...portion, [e.target.name]: e.target.value });
  };

  const addPortion = () => {
    if (portion.label && portion.grams && portion.oz) {
      setPortions([...portions, portion]);
      setPortion({ label: '', grams: '', oz: '' });
    }
  };

  const removePortion = (idx: number) => {
    setPortions(portions.filter((_, i) => i !== idx));
  };

  return (
    <main className="p-6 bg-white dark:bg-gray-900 dow-md w-350 py-5 ">
    <div className="flex flex-col md:flex-row gap-8 ">
      {/* Image upload */}
      <div className="flex-1 max-w-xs flex flex-col items-center justify-start">
        <label className="w-full h-[340px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Food"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <span className="flex flex-col items-center justify-center text-gray-400">
                <img src={ICONS.addimage} alt="Add" width={40} height={40} />
                <span className="mt-2 text-sm">Add picture (optional)</span>
              </span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>
      {/* Form section */}
      <div className="flex-1 min-w-[320px]">
        <div className="mb-4">
          <div className="flex items-center gap-2">
          <h2 className="font-adelle text-[17px] font-normal text-black">Item Details  <span className="font-ceraPro text-lightGray text-[15px] font-normal">(Macro per 100g)</span></h2>
          </div>
          <p className="text-xs text-lightGray mt-1">
            Enter the nutritional values based on 100 grams of this food item.<br />
            The app will use this to calculate macro intake based on portion sizes. 
          </p>
          <div className="w-full border-b border-gray-200 my-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              name="name"
              value={food.name}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-4 text-sm text-darkGray focus:outline-none"
              placeholder="Pizza"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Calories</label>
            <input
              name="calories"
              value={food.calories}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-4 text-sm text-darkGray focus:outline-none "
              placeholder="650"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Proteins (g)</label>
            <input
              name="protein"
              value={food.protein}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-4 text-sm text-darkGray focus:outline-none"
              placeholder="12"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fats (g)</label>
            <input
              name="fat"
              value={food.fat}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-4 text-sm text-darkGray focus:outline-none "
              placeholder="12"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Carbs (g)</label>
            <input
              name="carbs"
              value={food.carbs}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-4 text-sm text-darkGray focus:outline-none "
              placeholder="22"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fiber (g)</label>
            <input
              name="fiber"
              value={food.fiber}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-4 text-sm text-darkGray focus:outline-none "
              placeholder="50"
            />
          </div>
        </div>
        <div className="mt-6">
        <span className="font-adelle text-[17px] font-medium text-gray-800 pt-4">Portion Options</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2 mb-2 w-full">
            <div className="w-full">
              <label className="block text-xs text-gray-500 mb-1">Portion Label</label>
              <input
                name="label"
                value={portion.label}
                onChange={handlePortionChange}
                className="w-full border border-gray-200 rounded-[7px] px-3 py-3 text-sm focus:outline-none "
                placeholder="Write here"
              />
            </div>
            <div className="w-full">
              <label className="block text-xs text-gray-500 mb-1">In Grams</label>
              <input
                name="grams"
                value={portion.grams}
                onChange={handlePortionChange}
                className="w-full border border-gray-200 rounded-[7px] px-3 py-3 text-sm focus:outline-none "
                placeholder="Write here"
              />
            </div>
            <div className="w-full">
              <label className="block text-xs text-gray-500 mb-1">In Oz</label>
              <input
                name="oz"
                value={portion.oz}
                onChange={handlePortionChange}
                className="w-full border border-gray-200 rounded-[7px] px-3 py-3 text-sm focus:outline-none "
                placeholder="Write here"
              />
            </div>
            <div className="flex items-end w-full">
              <button
                type="button"
                onClick={addPortion}
                className="flex items-center justify-center rounded-[7px] bg-white text-black  border border-black"
                style={{ width: '45px', height: '45px' }}
              >
                <Plus size={32} />
              </button>
            </div>
          </div>
          {/* Portion list hidden as requested */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-darkGray">Slice 50 grams/5 Oz</span>
            
              <button type="button" className="ml-1 text-gray-400 hover:text-lightGray">
                <X size={25} />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-darkGray">Whole pizza 600 grams/50 Oz</span>
             
              <button type="button" className="ml-1 text-gray-400 hover:text-gray-600">
                <X size={25} />
              </button>
            </div>
          </div>
          <div className="w-full border-b border-gray-200 my-4"></div>
        </div>
        <div className=" mt-2 mb-8 md:mb-12">
        <button
          type="button"
          disabled={Object.values(food).some(v => !v)}
          className={`w-full mt-8 py-3 rounded-[7px] font-semibold text-base transition ${Object.values(food).some(v => !v) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-lightBrown text-darkGray hover:bg-[#ecd2b2]'}`}
        >
          Publish
        </button>


        </div>
        
      </div>
    </div>
    </main>
  );
};

export default AddFood;
