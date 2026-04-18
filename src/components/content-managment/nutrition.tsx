"use client" ;

import React, { useState } from 'react';
import { Button } from "../ui/button";
import Pagination from "../common/pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "../ui/dialog";
import ICONS from '@/assets/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../ui/sheet";
import { useRouter } from 'next/navigation';
import NutritionService from '@/services/nutritionService';
import { INutrition, IBaseFood, IMealPlanItem, IBaseSupplement } from '@/types/api';

// --- TYPES ---
type FoodRow = { name: string; calories: number; carbs: number; protein: number; fat: number; fiber: number; lastModified: string };
type SimpleRow = { name: string; unit: string; lastModified: string };

const aboutLines: string[] = [
  "Hi there! I'm a certified nutritionist and personal trainer, and I'm passionate about helping people achieve their health and fitness goals.",
  "With a tailored approach to nutrition and exercise, I work closely with clients to create personalized plans that fit their unique needs and lifestyles.",
  "My goal is to empower you to make sustainable changes for long-term health and well-being.",
  "I believe in a balanced approach that includes both nutrition and physical activity.",
  "Let's work together to achieve your health and fitness goals!"
];

const Nutrition = () => {
  const [activeTab, setActiveTab] = useState<'Nutrition' | 'Workouts'>('Nutrition');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Foods');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Increased to show more items and get better variety
  const [addModalCategory, setAddModalCategory] = useState<string | null>(null);
  const dropdownMenuContext = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // API state
  const [nutritions, setNutritions] = useState<INutrition[]>([]);
  const [baseFoods, setBaseFoods] = useState<IBaseFood[]>([]);
  const [mealPlanItems, setMealPlanItems] = useState<IMealPlanItem[]>([]);
  const [baseSupplements, setBaseSupplements] = useState<IBaseSupplement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalNutritions, setTotalNutritions] = useState(0);
  const [totalBaseFoods, setTotalBaseFoods] = useState(0);
  const [totalMealPlanItems, setTotalMealPlanItems] = useState(0);
  const [totalBaseSupplements, setTotalBaseSupplements] = useState(0);

  // State for add modals
  const [proteinName, setProteinName] = useState('');
  const [proteinGrams, setProteinGrams] = useState('');
  const [proteinOz, setProteinOz] = useState('');
  const isProteinFilled = proteinName.trim() && proteinGrams.trim() && proteinOz.trim();

  const [carbName, setCarbName] = useState('');
  const [carbGrams, setCarbGrams] = useState('');
  const [carbOz, setCarbOz] = useState('');
  const isCarbFilled = carbName.trim() && carbGrams.trim() && carbOz.trim();

  const [vegName, setVegName] = useState('');
  const [vegGrams, setVegGrams] = useState('');
  const [vegOz, setVegOz] = useState('');
  const isVegFilled = vegName.trim() && vegGrams.trim() && vegOz.trim();

  const [suppName, setSuppName] = useState('');
  const isSuppFilled = suppName.trim();

  // State for meal plan item modal
  const [mealItemName, setMealItemName] = useState('');
  const [mealItemGrams, setMealItemGrams] = useState('');
  const [mealItemOz, setMealItemOz] = useState('');
  const isMealItemFilled = mealItemName.trim() && mealItemGrams.trim() && mealItemOz.trim();

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // Handle meal plan item creation
  const handleCreateMealPlanItem = async () => {
    try {
      const itemTypeMap = {
        'Proteins': 'PROTEIN',
        'Carbohydrates': 'CARB',
        'Vegetables': 'VEGGIE'
      } as const;
      
      const itemType = itemTypeMap[addModalCategory as keyof typeof itemTypeMap];
      
      if (!itemType) {
        throw new Error('Invalid category for meal plan item');
      }

      const mealPlanItemData = {
        itemType,
        itemName: mealItemName,
        quantityInGrams: parseInt(mealItemGrams),
        quantityInOz: parseInt(mealItemOz)
      };

      await NutritionService.createMealPlanItem(mealPlanItemData);
      
      // Reset form
      setMealItemName('');
      setMealItemGrams('');
      setMealItemOz('');
      setAddModalCategory(null);
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error creating meal plan item:', error);
      setError('Failed to create meal plan item');
    }
  };



  // Fetch nutritions from API
  const fetchNutritions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await NutritionService.getNutritions(currentPage, itemsPerPage);
      
      if (response.success && response.data) {
        setNutritions(response.data);
        setTotalNutritions(response.total);
      } else {
        setError('Failed to fetch nutritions');
      }
    } catch (err) {
      console.error('Error fetching nutritions:', err);
      setError('Failed to fetch nutritions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch base foods from API
  const fetchBaseFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await NutritionService.getBaseFoods(currentPage, itemsPerPage);
      
      if (response.success && response.data) {
        setBaseFoods(response.data);
        setTotalBaseFoods(response.total);
      } else {
        setError('Failed to fetch base foods');
      }
    } catch (err) {
      console.error('Error fetching base foods:', err);
      setError('Failed to fetch base foods');
    } finally {
      setLoading(false);
    }
  };

  // Fetch meal plan items from API
  const fetchMealPlanItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch more items to ensure we have enough variety for all categories
      const response = await NutritionService.getMealPlanItems(currentPage, itemsPerPage * 3);
      
      if (response.success && response.data) {
        setMealPlanItems(response.data);
        setTotalMealPlanItems(response.total);
      } else {
        setError('Failed to fetch meal plan items');
      }
    } catch (err) {
      console.error('Error fetching meal plan items:', err);
      setError('Failed to fetch meal plan items');
    } finally {
      setLoading(false);
    }
  };

  // Fetch base supplements from API
  const fetchBaseSupplements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await NutritionService.getBaseSupplements(currentPage, itemsPerPage);
      
      if (response.success && response.data) {
        setBaseSupplements(response.data);
        setTotalBaseSupplements(response.total);
      } else {
        setError('Failed to fetch base supplements');
      }
    } catch (err) {
      console.error('Error fetching base supplements:', err);
      setError('Failed to fetch base supplements');
    } finally {
      setLoading(false);
    }
  };



  // Fetch data based on category
  const fetchData = async () => {
    if (category === 'Foods') {
      await fetchBaseFoods();
    } else if (['Proteins', 'Carbohydrates', 'Vegetables'].includes(category)) {
      await fetchMealPlanItems();
    } else if (category === 'Supplements & Products') {
      await fetchBaseSupplements();
    } else {
      await fetchNutritions();
    }
  };

  // Fetch data on component mount and when page or category changes
  useEffect(() => {
    fetchData();
  }, [currentPage, category]);

  // --- FILTER, PAGINATE, AND RENDER DYNAMIC TABLE ---
  // Determine which data to use based on category
  let dataToUse: any[] = [];
  let totalItems = 0;
  
  if (category === 'Foods') {
    dataToUse = baseFoods;
    totalItems = totalBaseFoods;
  } else if (['Proteins', 'Carbohydrates', 'Vegetables'].includes(category)) {
    dataToUse = mealPlanItems;
    totalItems = totalMealPlanItems;
  } else if (category === 'Supplements & Products') {
    dataToUse = baseSupplements;
    totalItems = totalBaseSupplements;
  } else {
    // For other categories, show empty state since no API is available
    dataToUse = [];
    totalItems = 0;
  }
  
  const filteredData = dataToUse.filter((item: any) => {
    if (category === 'Foods') {
      // For base foods API data, search by foodName
      return item.foodName.toLowerCase().includes(search.toLowerCase());
    } else if (['Proteins', 'Carbohydrates', 'Vegetables'].includes(category)) {
      // For meal plan items, filter by itemType and search by itemName
      const itemTypeMap = {
        'Proteins': 'PROTEIN',
        'Carbohydrates': 'CARB',
        'Vegetables': 'VEGGIE'
      };
      const expectedType = itemTypeMap[category as keyof typeof itemTypeMap];
      return item.itemType === expectedType && 
             item.itemName.toLowerCase().includes(search.toLowerCase());
    } else if (category === 'Supplements & Products') {
      // For supplements, search by supplementName
      return item.supplementName.toLowerCase().includes(search.toLowerCase());
    } else {
      // For other categories, no filtering needed since data is empty
      return false;
    }
  });
  
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  


  return (
    <div className='w-full'>
      
    <main className="p-6 bg-white dark:bg-gray-900 dow-md w-full">

 <span className="font-adelle text-[17px] font-medium text-gray-800 pb-6">Content Management</span>
      {/* Tabs */}
      <div className=" bg-white flex gap-2 mb-6 pt-8 pb-2 ">
        <Button
          onClick={() => setActiveTab('Nutrition')}
          className={`py-2 px-4 rounded-[8px] font-light hover:bg-lightBrown text-sm transition-colors duration-200
    ${activeTab === 'Nutrition'
      ? 'bg-lightBrown text-black text-[17px] font-semibold'
      : 'bg-white text-gray-600 border border-gray-200 hover:bg-lightBrown'}
  `}
        >
          Nutrition
        </Button>
        <Button
          onClick={() => router.push('/content-management/workouts')}
          className={`py-2 px-4 rounded-[8px] font-light hover:bg-lightBrown text-sm transition-colors duration-200
    ${activeTab === 'Workouts'
      ? 'bg-lightBrown text-black text-[17px] font-semibold'
      : 'bg-white text-darkGray border border-gray-200 hover:bg-lightBrown'}
  `}
        >
          Workouts
        </Button>
      </div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 mb-4">
        <div className="relative w-full md:w-[400px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="appearance-none w-full h-12 pl-4 pr-3 text-base font-medium bg-white border border-gray-200 rounded-[7px] flex items-center justify-between"
                type="button"
              >
                {category}
                <span className="ml-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 8L10 12L14 8" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </DropdownMenuTrigger>

    {/* 👇 This line ensures dropdown matches trigger width exactly */}
    <DropdownMenuContent
      align="start"
      className="min-w-[var(--radix-dropdown-menu-trigger-width)] p-0 bg-white rounded-xl shadow-lg"
    >
              <ul className="py-2">
                {["Foods", "Proteins", "Carbohydrates", "Vegetables", "Supplements & Products"].map((item) => (
                  <DropdownMenuItem asChild key={item}>
                    <li
                      onClick={() => setCategory(item)}
              className={`px-5 py-3 cursor-pointer
                        ${category === item ? "font-bold text-black" : "font-normal text-gray-700"}
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


        {/* Search bar and plus button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full md:w-[400px] mt-2 md:mt-0">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-200 rounded-[7px] px-4 py-3 text-base font-medium focus:outline-none w-full h-12 pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="9" cy="9" r="7" stroke="#B0B0B0" strokeWidth="2" />
                <path d="M15 15L18 18" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <button
            className="w-12 h-12 flex items-center justify-center rounded-[3px] bg-lightBrown hover:bg-[#f5e0c7] transition-colors"
            aria-label="Add"
            onClick={() => {
              if (category === 'Foods') {
                router.push('/content-management/add-food-nutrtion');
              } else if (['Proteins', 'Carbohydrates', 'Vegetables'].includes(category)) {
                setAddModalCategory(category);
              } else if (category === 'Supplements & Products') {
                setAddModalCategory('Supplements');
              } else {
                setAddModalCategory(category);
              }
            }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="#222" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          <span className="ml-3 text-gray-600">Loading nutritions...</span>
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

      {/* Table */}
      {!loading && !error && (
        <div className="-mx-6 overflow-x-auto">
          {paginatedData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  {search ? `No ${category.toLowerCase()} found matching "${search}"` : `No ${category.toLowerCase()} available`}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <table className="w-full min-w-full border-collapse bg-white">
            <thead>
              <tr className="bg-white rounded-[8px] h-10">
                {category === 'Foods' ? (
                  <>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-left">Food Name</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Calories</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Proteins (g)</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Carbs (g)</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Fats (g)</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Fiber (g)</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Created By</th>
                  </>
                ) : ['Proteins', 'Carbohydrates', 'Vegetables'].includes(category) ? (
                  <>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-left">Item Name</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Quantity (g)</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Quantity (oz)</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Created At</th>
                  </>
                ) : category === 'Supplements & Products' ? (
                  <>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-left">Supplement Name</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Created At</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Updated At</th>
                  </>
                ) : (
                  <>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-left">Product</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Measurement Unit</th>
                    <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Last Updated</th>
                  </>
                )}
                <th className="py-2 px-4 font-ceraPro text-large text-darkGray text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item: any, idx: number) => (
                <tr key={category === 'Foods' ? item._id : 
                         category === 'Supplements & Products' ? item._id :
                         item.name + idx} className="border-b border-gray-200 text-lightGray bg-white">
                  {category === 'Foods' ? (
                    <>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-left">
                        <span className="flex items-center gap-3">
                          <img
                            src={item.foodImage || ICONS.activity3}
                            alt="food-icon"
                            className="w-10 h-10 rounded-[7px] object-cover border border-gray-200 bg-[#F6F6F6]"
                          />
                          <span>{item.foodName}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {item.calories}
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {item.proteins}
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {item.carbs}
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {item.fats}
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {item.fiber}
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {item.createdBy ? `${item.createdBy.firstName} ${item.createdBy.lastName}` : 'Unknown User'}
                      </td>
                    </>
                  ) : ['Proteins', 'Carbohydrates', 'Vegetables'].includes(category) ? (
                    <>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-left">
                        <span className="flex items-center gap-3">
                          <img
                            src={ICONS.activity3}
                            alt="item-icon"
                            className="w-10 h-10 rounded-[7px] object-cover border border-gray-200 bg-[#F6F6F6]"
                          />
                          <span>{item.itemName}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {item.quantityInGrams}
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {item.quantityInOz}
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </>
                  ) : category === 'Supplements & Products' ? (
                    <>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-left">
                        <span className="flex items-center gap-3">
                          <img
                            src={ICONS.capsule}
                            alt="supplement-icon"
                            className="w-10 h-10 rounded-[7px] object-cover border border-gray-200 bg-[#F6F6F6]"
                          />
                          <span>{item.supplementName}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-left">
                        <span className="flex items-center gap-3">
                          <img
                            src={ICONS.activity3}
                            alt="product-icon"
                            className="w-10 h-10 rounded-[7px] object-cover border border-gray-200 bg-[#F6F6F6]"
                          />
                          <span>No data available</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        -
                      </td>
                      <td className="py-4 px-4 font-ceraPro font-[500] text-[16px] leading-[140%] tracking-[0] text-center">
                        -
                      </td>
                    </>
                  )}
                  <td className="py-4 px-4 text-center">
                    <NutritionActionDropdown foodName={category === 'Foods' ? item.foodName : 
                                                   ['Proteins', 'Carbohydrates', 'Vegetables'].includes(category) ? item.itemName : 
                                                   category === 'Supplements & Products' ? item.supplementName :
                                                   'No data'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      )}
      </main>
      {/* Pagination */}
      {!loading && !error && (
        <div className="flex justify-end w-full mt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemName="foods"
            showInfo={false}
          />
        </div>
      )}
      {addModalCategory === "Proteins" && (
        <Sheet open={addModalCategory === "Proteins"} onOpenChange={open => !open && setAddModalCategory(null)}>
          <SheetContent side="right" className="w-full max-w-full sm:!w-[400px] md:!w-[600px] !max-w-none bg-white p-4 sm:p-8 overflow-y-auto max-h-[100vh] flex flex-col">
            <SheetHeader className="flex flex-row items-center justify-between mb-4">
              <SheetTitle className="font-adelle text-[25px] font-semibold">Add Proteins</SheetTitle>
              <SheetClose asChild>
                <button
                  aria-label="Close"
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-lightBrown"
                  type="button"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </SheetClose>
            </SheetHeader>
            <form className="flex flex-col gap-6 mt-4 overflow-y-auto flex-1 w-full">
              <div>
                <label className="font-adelle text-[20px] font-semibold mb-4">Name</label>
                <input
                  type="text"
                  placeholder="Write here..."
                  className="w-full min-w-0 border border-gray-200 rounded-[7px] px-2 py-4 text-base font-medium focus:outline-none"
                  value={proteinName}
                  onChange={e => setProteinName(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-adelle text-[20px] font-semibold mb-4">Measurement in grams</label>
                  <div className="flex items-center w-full border border-gray-200 rounded-[7px] px-2 py-4 bg-white">
                    <input
                      type="text"
                      placeholder="Write here.."
                      className="flex-1 bg-transparent border-none outline-none text-base font-medium min-w-0"
                      value={proteinGrams}
                      onChange={e => setProteinGrams(e.target.value)}
                    />
                    <span className="ml-2 text-gray-400 text-base">Grams</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="font-adelle text-[20px] font-semibold mb-4">Measurement in oz</label>
                  <div className="flex items-center w-full border border-gray-200 rounded-[7px] px-2 py-4 bg-white">
                    <input
                      type="text"
                      placeholder="Write here.."
                      className="flex-1 bg-transparent border-none outline-none text-base font-medium min-w-0"
                      value={proteinOz}
                      onChange={e => setProteinOz(e.target.value)}
                    />
                    <span className="ml-2 text-gray-400 text-base">Oz</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-[7px] font-semibold mt-2 transition-colors ${isProteinFilled ? 'bg-lightBrown text-black' : 'bg-gray-200 text-gray-700'}`}
                disabled={!isProteinFilled}
              >
                Publish
              </button>
            </form>
          </SheetContent>
        </Sheet>
      )}
      {addModalCategory === "Carbohydrates" && (
        <Sheet open={addModalCategory === "Carbohydrates"} onOpenChange={open => !open && setAddModalCategory(null)}>
          <SheetContent side="right" className="w-full max-w-full sm:!w-[400px] md:!w-[600px] !max-w-none bg-white p-4 sm:p-8 overflow-y-auto max-h-[100vh] flex flex-col">
            <SheetHeader className="flex flex-row items-center justify-between mb-4">
              <SheetTitle className="font-adelle text-[20px] font-semibold">Add Carbohydrates</SheetTitle>
              <SheetClose asChild>
                <button
                  aria-label="Close"
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-lightBrown"
                  type="button"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </SheetClose>
            </SheetHeader>
            <form className="flex flex-col gap-6 mt-4 overflow-y-auto flex-1 w-full">
              <div>
                <label className="font-adelle text-[20px] font-semibold mb-4">Name</label>
                <input
                  type="text"
                  placeholder="Write here..."
                  className="w-full min-w-0 border border-gray-200 rounded-[7px] px-2 py-4 text-base font-medium focus:outline-none"
                  value={carbName}
                  onChange={e => setCarbName(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-adelle text-[20px] font-semibold mb-4">Measurement in grams</label>
                  <div className="flex items-center w-full border border-gray-200 rounded-[7px] px-2 py-4 bg-white">
                    <input
                      type="text"
                      placeholder="Write here.."
                      className="flex-1 bg-transparent border-none outline-none text-base font-medium min-w-0"
                      value={carbGrams}
                      onChange={e => setCarbGrams(e.target.value)}
                    />
                    <span className="ml-2 text-gray-400 text-base">Grams</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="font-adelle text-[20px] font-semibold mb-4">Measurement in oz</label>
                  <div className="flex items-center w-full border border-gray-200 rounded-[7px] px-2 py-4 bg-white">
                    <input
                      type="text"
                      placeholder="Write here.."
                      className="flex-1 bg-transparent border-none outline-none text-base font-medium min-w-0"
                      value={carbOz}
                      onChange={e => setCarbOz(e.target.value)}
                    />
                    <span className="ml-2 text-gray-400 text-base">Oz</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-[7px] font-semibold mt-2 transition-colors ${isCarbFilled ? 'bg-lightBrown text-black' : 'bg-gray-200 text-gray-700'}`}
                disabled={!isCarbFilled}
              >
                Publish
              </button>
            </form>
          </SheetContent>
        </Sheet>
      )}
      {addModalCategory === "Vegetables" && (
        <Sheet open={addModalCategory === "Vegetables"} onOpenChange={open => !open && setAddModalCategory(null)}>
          <SheetContent side="right" className="w-full max-w-full sm:!w-[400px] md:!w-[600px] !max-w-none bg-white p-4 sm:p-8 overflow-y-auto max-h-[100vh] flex flex-col">
            <SheetHeader className="flex flex-row items-center justify-between mb-4">
              <SheetTitle className="font-adelle text-[20px] font-semibold">Add Vegetables</SheetTitle>
              <SheetClose asChild>
                <button
                  aria-label="Close"
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-lightBrown"
                  type="button"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </SheetClose>
            </SheetHeader>
            <form className="flex flex-col gap-6 mt-4 overflow-y-auto flex-1 w-full">
              <div>
                <label className="font-adelle text-[20px] font-semibold mb-4">Name</label>
                <input
                  type="text"
                  placeholder="Write here..."
                  className="w-full min-w-0 border border-gray-200 rounded-[7px] px-2 py-4 text-base font-medium focus:outline-none"
                  value={vegName}
                  onChange={e => setVegName(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-adelle text-[20px] font-semibold mb-4">Measurement in grams</label>
                  <div className="flex items-center w-full border border-gray-200 rounded-[7px] px-2 py-4 bg-white">
                    <input
                      type="text"
                      placeholder="Write here.."
                      className="flex-1 bg-transparent border-none outline-none text-base font-medium min-w-0"
                      value={vegGrams}
                      onChange={e => setVegGrams(e.target.value)}
                    />
                    <span className="ml-2 text-gray-400 text-base">Grams</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="font-adelle text-[20px] font-semibold mb-4">Measurement in oz</label>
                  <div className="flex items-center w-full border border-gray-200 rounded-[7px] px-2 py-4 bg-white">
                    <input
                      type="text"
                      placeholder="Write here.."
                      className="flex-1 bg-transparent border-none outline-none text-base font-medium min-w-0"
                      value={vegOz}
                      onChange={e => setVegOz(e.target.value)}
                    />
                    <span className="ml-2 text-gray-400 text-base">Oz</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-[7px] font-semibold mt-2 transition-colors ${isVegFilled ? 'bg-lightBrown text-black' : 'bg-gray-200 text-gray-700'}`}
                disabled={!isVegFilled}
              >
                Publish
              </button>
            </form>
          </SheetContent>
        </Sheet>
      )}
      {addModalCategory === "Supplements & Products" && (
        <Sheet open={addModalCategory === "Supplements & Products"} onOpenChange={open => !open && setAddModalCategory(null)}>
          <SheetContent side="right" className="w-full max-w-full sm:!w-[400px] md:!w-[600px] !max-w-none bg-white p-4 sm:p-8 overflow-y-auto max-h-[100vh] flex flex-col">
            <SheetHeader className="flex flex-row items-center justify-between mb-4">
              <SheetTitle className="font-adelle text-[20px] font-semibold">Add Supplements & Products</SheetTitle>
              <SheetClose asChild>
                <button
                  aria-label="Close"
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                  type="button"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </SheetClose>
            </SheetHeader>
            <form className="flex flex-col gap-6 mt-4 overflow-y-auto flex-1 w-full">
              <div>
                <label className="font-adelle text-[20px] font-semibold mb-4">Name</label>
                <input
                  type="text"
                  placeholder="Write here..."
                  className="w-full min-w-0 border border-gray-200 rounded-[7px] px-2 py-4 text-base font-medium focus:outline-none"
                  value={suppName}
                  onChange={e => setSuppName(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-[7px] font-semibold mt-2 transition-colors ${isSuppFilled ? 'bg-lightBrown text-black' : 'bg-gray-200 text-gray-700'}`}
                disabled={!isSuppFilled}
              >
                Publish
              </button>
            </form>
          </SheetContent>
        </Sheet>
      )}
      {/* Meal Plan Item Modal for Proteins, Carbohydrates, Vegetables */}
      {['Proteins', 'Carbohydrates', 'Vegetables'].includes(addModalCategory || '') && (
        <Sheet open={['Proteins', 'Carbohydrates', 'Vegetables'].includes(addModalCategory || '')} onOpenChange={open => !open && setAddModalCategory(null)}>
          <SheetContent side="right" className="w-full max-w-full sm:!w-[400px] md:!w-[600px] !max-w-none bg-white p-4 sm:p-8 overflow-y-auto max-h-[100vh] flex flex-col">
            <SheetHeader className="flex flex-row items-center justify-between mb-4">
              <SheetTitle className="font-adelle text-[20px] font-semibold">Add {addModalCategory}</SheetTitle>
              <SheetClose asChild>
                <button
                  aria-label="Close"
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-lightBrown"
                  type="button"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </SheetClose>
            </SheetHeader>
            <form className="flex flex-col gap-6 mt-4 overflow-y-auto flex-1 w-full" onSubmit={(e) => { e.preventDefault(); handleCreateMealPlanItem(); }}>
              <div>
                <label className="font-adelle text-[20px] font-semibold mb-4">Item Name</label>
                <input
                  type="text"
                  placeholder="Write here..."
                  className="w-full min-w-0 border border-gray-200 rounded-[7px] px-2 py-4 text-base font-medium focus:outline-none"
                  value={mealItemName}
                  onChange={e => setMealItemName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-adelle text-[20px] font-semibold mb-4">Quantity in grams</label>
                  <div className="flex items-center w-full border border-gray-200 rounded-[7px] px-2 py-4 bg-white">
                    <input
                      type="number"
                      placeholder="Write here.."
                      className="flex-1 bg-transparent border-none outline-none text-base font-medium min-w-0"
                      value={mealItemGrams}
                      onChange={e => setMealItemGrams(e.target.value)}
                      required
                    />
                    <span className="ml-2 text-gray-400 text-base">Grams</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="font-adelle text-[20px] font-semibold mb-4">Quantity in oz</label>
                  <div className="flex items-center w-full border border-gray-200 rounded-[7px] px-2 py-4 bg-white">
                    <input
                      type="number"
                      placeholder="Write here.."
                      className="flex-1 bg-transparent border-none outline-none text-base font-medium min-w-0"
                      value={mealItemOz}
                      onChange={e => setMealItemOz(e.target.value)}
                      required
                    />
                    <span className="ml-2 text-gray-400 text-base">Oz</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-[7px] font-semibold mt-2 transition-colors ${isMealItemFilled ? 'bg-lightBrown text-black' : 'bg-gray-200 text-gray-700'}`}
                disabled={!isMealItemFilled}
              >
                Publish
              </button>
            </form>
          </SheetContent>
        </Sheet>
      )}
    </div>
 
        )
};

function NutritionActionDropdown({ foodName }: { foodName: string }) {
  const [open, setOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <MoreVertical size={20} />
        </button>
        {open && (
          <div className="absolute right-0 mt-1 w-40 bg-white rounded-[10px] shadow-lg border border-gray-200 z-10">
            <button
              className="w-full px-4 py-3 text-left text-[15px] font-normal text-darkGray  hover:bg-gray-50 rounded-t-[10px] border-b border-gray-200 transition-colors"
              style={{ fontFamily: 'inherit' }}
              onClick={() => {
                setOpen(false);
                // handle edit here
              }}
            >
              Edit
            </button>
            <button
              className="w-full px-4 py-3 text-left text-[15px] font-normal text-darkGray hover:bg-gray-50 rounded-b-[10px] transition-colors"
              style={{ fontFamily: 'inherit' }}
              onClick={() => {
                setOpen(false);
                setShowDeleteDialog(true);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {/* Delete Confirmation Dialog - styled like userInfo.tsx */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-[340px] !rounded-[2rem] p-6 text-center shadow-lg border-0 bg-white" hideClose>
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
              <img src={ICONS.question} alt="question" className="w-10 h-10" />
            </div>
            <DialogTitle className="font-adelle text-[17px] font-medium text-gray-800">Are you sure</DialogTitle>
            <DialogDescription className="mb-7 text-lightGray text-base">Do you want to Delete <b>{foodName}</b>?</DialogDescription>
            <div className="flex gap-3 w-full">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1 py-2 rounded-[7px] border border-black bg-white text-black font-semibold shadow-none">Cancel</Button>
              </DialogClose>
              <Button className="flex-1 py-2 rounded-[7px] bg-lightBrown text-black font-bold hover:bg-lightBrown border-none shadow-none">Yes, Delete</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Nutrition;
