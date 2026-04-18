"use client"
import React, { useState, useRef, useEffect } from "react";
import ICONS from "@/assets/icons";
import RichTextEditor from "@/components/ui/rich-text-editor";
import WorkoutService from '@/services/workoutService';
import { useRouter } from 'next/navigation';
import { errorToast, successToast } from '@/lib/toasts';

export default function AddWorkout() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("BEGINNER");
  const [duration, setDuration] = useState<string>("5");
  const [formData, setFormData] = useState({
    title: "",
    tagLine: "",
    description: "",
    focusArea: "",
    equipment: ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const levels = ["BEGINNER", "INTERMEDIATE", "EXPERT"];
  const durations = ["1", "2", "3", "4", "5", "6", "8", "12"];
  
  // Load saved form data from localStorage on component mount
  useEffect(() => {
    setMounted(true);
    const savedFormData = localStorage.getItem('addworkout-form-data');
    const savedLevel = localStorage.getItem('addworkout-level');
    const savedDuration = localStorage.getItem('addworkout-duration');
    const savedImagePreview = localStorage.getItem('addworkout-image-preview');
    
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    
    if (savedLevel) {
      setSelectedLevel(savedLevel);
    }
    
    if (savedDuration) {
      setDuration(savedDuration);
    }
    
    if (savedImagePreview) {
      setImagePreview(savedImagePreview);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('addworkout-form-data', JSON.stringify(formData));
      localStorage.setItem('addworkout-level', selectedLevel);
      localStorage.setItem('addworkout-duration', duration);
      if (imagePreview) {
        localStorage.setItem('addworkout-image-preview', imagePreview);
      }
    }
  }, [formData, selectedLevel, duration, imagePreview, mounted]);
  
  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const clearSavedData = () => {
    localStorage.removeItem('addworkout-form-data');
    localStorage.removeItem('addworkout-level');
    localStorage.removeItem('addworkout-duration');
    localStorage.removeItem('addworkout-image-preview');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        localStorage.setItem('addworkout-image-preview', result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleRichTextToggle = (format: string) => {
    switch (format) {
      case 'bold':
        setIsBold(!isBold);
        break;
      case 'italic':
        setIsItalic(!isItalic);
        break;
      case 'underline':
        setIsUnderline(!isUnderline);
        break;
      case 'strikethrough':
        setIsStrikethrough(!isStrikethrough);
        break;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sanitize description - remove HTML tags and convert to plain text
      const sanitizeDescription = (html: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
      };

      // Prepare workout data
      const workoutData = {
        title: formData.title.trim(),
        tagLine: formData.tagLine.trim(),
        description: sanitizeDescription(formData.description).trim(),
        durationInWeeks: parseInt(duration),
        level: selectedLevel,
        focusArea: formData.focusArea.trim(),
        equipment: formData.equipment.trim()
      };

      // Validate required fields
      if (!workoutData.title || !workoutData.tagLine || !workoutData.description || !workoutData.focusArea || !workoutData.equipment) {
        const msg = 'Please fill in all required fields';
        setError(msg);
        errorToast(msg);
        setLoading(false);
        return;
      }

      // Create workout first
      const response = await WorkoutService.createWorkout(workoutData);
      
      if (response.success && selectedImage) {
        try {
          // If there's an image, upload it using WorkoutService
          const workoutId = response.data?._id || response.data?.[0]?._id;
          
          if (!workoutId) {
            console.error('No workout ID found in response:', response);
            throw new Error('Failed to get workout ID');
          }
          
          // Clean filename by removing extension
          let cleanFileName = selectedImage.name;
          const lastDotIndex = cleanFileName.lastIndexOf('.');
          if (lastDotIndex !== -1) {
            cleanFileName = cleanFileName.substring(0, lastDotIndex);
          }
          
          console.log('Starting image upload process for workout:', workoutId);
          console.log('Original filename:', selectedImage.name);
          console.log('Clean filename (no extension):', cleanFileName);
          console.log('Image file details:', {
            name: cleanFileName,
            size: selectedImage.size,
            type: selectedImage.type
          });
          
          // Upload image using WorkoutService.uploadImage method
          const uploadResult = await WorkoutService.uploadImage(workoutId, selectedImage);
          
          if (uploadResult.success) {
            console.log('✅ Image uploaded successfully:', uploadResult);
          } else {
            console.error('❌ Failed to upload image:', uploadResult);
            errorToast('Failed to upload image');
          }
        } catch (imageError) {
          console.error('❌ Error uploading image:', imageError);
          errorToast((imageError as any)?.message || 'Error uploading image');
          // Don't fail the entire submission if image upload fails
        }
      }

      successToast('Workout plan saved successfully!');
      
      // Clear saved data after successful submission
      clearSavedData();
      
      // Navigate to daily workout page with the workout ID
      const workoutId = response.data?._id || response.data?.[0]?._id;
      if (workoutId) {
        // Navigate to workout days card with the duration as the selected week
        router.push(`/content-management/dailyworkout?workoutId=${workoutId}&selectedWeek=${duration}`);
      } else {
        router.push('/content-management/workouts');
      }
    } catch (err: any) {
      console.error('Error creating workout:', err);
      const msg = err?.message || 'Failed to create workout';
      setError(msg);
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 w-full px-2 sm:px-4 md:px-8 py-6">
      {/* Left: Image Upload Card */}
      <div className="w-full lg:w-1/3 flex-shrink-0 mb-4 border-b border-gray-200 shadow-sm bg-white lg:border-b-0 lg:border-r lg:border-gray-200 lg:mb-0">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center h-32 sm:h-40 md:h-56 lg:h-64 bg-white cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleImageClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {imagePreview ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <p className="text-gray-600 font-medium mt-4">Click to change image</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <img src={ICONS.pickdate} alt="Date picker" className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Add picture</p>
            </>
          )}
        </div>
      </div>
      {/* Right: Form Fields Card */}
      <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm p-6 gap-4">
        {/* Title */}
        <div>
          <label className="font-adelle text-[25px] font-normal text-black mb-4">Title</label>
                     <input
             id="workout-title"
             name="title"
             type="text"
             placeholder="Write here..."
             value={formData.title}
             onChange={(e) => handleInputChange('title', e.target.value)}
             className="w-full px-4 py-4 border border-gray-200 rounded-[7px] focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white shadow-sm"
             required
           />
        </div>
        {/* Tag line */}
        <div>
          <label className="font-adelle text-[25px] font-normal text-black mb-4">Tag line</label>
                     <input
             id="workout-tagline"
             name="tagLine"
             type="text"
             placeholder="Write here..."
             value={formData.tagLine}
             onChange={(e) => handleInputChange('tagLine', e.target.value)}
             className="w-full px-4 py-4 border border-gray-200 rounded-[7px] focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white shadow-sm"
             required
           />
        </div>
        {/* Description */}
        <div>
          <label className="font-adelle text-[25px] font-normal text-black mb-2">Description</label>
          <RichTextEditor
            content={formData.description}
            onChange={val => handleInputChange('description', val)}
            placeholder="Write here..."
            onImageUpload={undefined}
            className="py-2"
            minHeight="80px"
          />
        </div>
        {/* Duration */}
        <div>
          <label className="font-adelle text-[25px] font-normal text-black mb-4">Duration</label>
                     <select
             id="workout-duration"
             name="duration"
             value={duration}
             onChange={(e) => setDuration(e.target.value)}
             className="w-full px-4 py-4 border border-gray-300 rounded-[7px] focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 appearance-none bg-gray-50 shadow-sm"
             required
           >
            {durations.map((dur) => (
              <option key={dur} value={dur}>{dur} weeks</option>
            ))}
          </select>
        </div>
        {/* Level */}
        <div>
          <label className="font-adelle text-[18px] font-normal text-black mb-4">Level</label>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-3 rounded-[7px] border text-sm font-medium transition-colors ${
                  selectedLevel === level
                    ? "bg-white text-gray-800 border-gray-400"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {selectedLevel === level && (
                  <svg className="w-4 h-4 mr-2 inline" fill="black" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {level}
              </button>
            ))}
            <div>
              <label className="font-adelle text-[18px] font-normal text-black mb-4">Focus area</label>
                             <input
                 id="workout-focus-area"
                 name="focusArea"
                 type="text"
                 placeholder="Write here..."
                 value={formData.focusArea}
                 onChange={(e) => handleInputChange('focusArea', e.target.value)}
                 className="w-full px-4 py-3 border border-gray-200 rounded-[7px] focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white shadow-sm"
                 required
               />
            </div>
          </div>
        </div>
        {/* Equipment's required */}
        <div className="mb-0">
          <label className="font-adelle text-[25px] font-normal text-black mb-4">Equipment's required</label>
                     <input
             id="workout-equipment"
             name="equipment"
             type="text"
             placeholder="Write here..."
             value={formData.equipment}
             onChange={(e) => handleInputChange('equipment', e.target.value)}
             className="w-full px-4 py-4 border border-gray-200 rounded-[7px] focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white shadow-sm"
             required
           />
        </div>
        {/* Error Display */}
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}
        
        <div className="mt-0 flex gap-4">
          <button
            type="button"
            onClick={() => {
              clearSavedData();
              setFormData({
                title: "",
                tagLine: "",
                description: "",
                focusArea: "",
                equipment: ""
              });
              setSelectedLevel("BEGINNER");
              setDuration("5");
              setSelectedImage(null);
              setImagePreview(null);
            }}
            className="flex-1 font-semibold py-3 px-6 rounded-[7px] border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 font-semibold py-3 px-6 rounded-[7px] transition-colors ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-lightBrown text-black hover:bg-[#f5e0c7]'
            }`}
          >
            {loading ? 'Saving...' : 'Save & Next'}
          </button>
        </div>
      </div>
    </form>
  );
}