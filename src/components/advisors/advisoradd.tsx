
"use client"
import React, { useState, useEffect } from 'react';
import ICONS from '@/assets/icons';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import AdvisorService from '@/services/advisorService';
import { successToast, errorToast } from '@/lib/toasts';

const genderOptions = [
  'Male',
  'Female',
  
];

const AdvisorAdd = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const advisorId = searchParams.get('advisorId');
  
  const [selectedGender, setSelectedGender] = useState('');
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  
  // Fetch advisor data if in edit mode
  useEffect(() => {
    const fetchAdvisorData = async () => {
      if (!isEditMode || !advisorId) return;
      
      try {
        setIsLoadingData(true);
        const response = await AdvisorService.getAdvisorById(advisorId);
        
        if (response.success && response.data) {
          const advisor = response.data as any; // Using any for now since the API response might not match the exact type
          
          // Populate form data
          setFormData({
            firstName: advisor.firstName || '',
            lastName: advisor.lastName || '',
            email: advisor.email || '',
            phoneNumber: advisor.phoneNumber || '',
            address: advisor.address || '',
            cognitoId: advisor.cognitoId || `user_${Date.now()}`,
            socialLinks: {
              facebook: advisor.socialLinks?.facebook || '',
              instagram: advisor.socialLinks?.instagram || '',
              linkedin: advisor.socialLinks?.linkedin || '',
              tiktok: advisor.socialLinks?.tiktok || ''
            }
          });
          
          // Set gender
          if (advisor.gender) {
            setSelectedGender(advisor.gender.charAt(0).toUpperCase() + advisor.gender.slice(1).toLowerCase());
          }
          
          // Set date of birth
          if (advisor.dateOfBirth) {
            setDob(parseISO(advisor.dateOfBirth));
          }
          
          // Set profile image if exists
          if (advisor.profileImage) {
            setImagePreview(advisor.profileImage);
          }
        }
      } catch (error) {
        console.error('Error fetching advisor data:', error);
        errorToast('Failed to load advisor data');
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchAdvisorData();
  }, [isEditMode, advisorId]);
  
  // Form state
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    cognitoId: string;
    socialLinks: {
      facebook: string;
      instagram: string;
      linkedin: string;
      tiktok: string;
    };
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    cognitoId: `user_${Date.now()}`, // Generate a unique ID
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedin: '',
      tiktok: ''
    }
  });

  const handleBackToAdvisors = () => {
    router.push('/advisors');
  };

  const handleDiscard = () => {
    router.push('/advisors');
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        errorToast('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errorToast('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev.socialLinks,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddAdvisor = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.address || !selectedGender || !dob) {
        errorToast('Please fill in all required fields');
        return;
      }

      // Prepare advisor data
      const advisorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        cognitoId: formData.cognitoId,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: dob ? format(dob, 'yyyy-MM-dd') : '',
        gender: selectedGender.toUpperCase(),
        socialLinks: {
          facebook: formData.socialLinks.facebook || undefined,
          instagram: formData.socialLinks.instagram || undefined,
          linkedin: formData.socialLinks.linkedin || undefined,
          tiktok: formData.socialLinks.tiktok || undefined,
        }
      };

      let response;
      
      if (isEditMode && advisorId) {
        console.log('Updating advisor with data:', advisorData);
        response = await AdvisorService.updateAdvisor(advisorId, advisorData);
        console.log('Advisor updated successfully:', response);
      } else {
        console.log('Creating advisor with data:', advisorData);
        response = await AdvisorService.createAdvisor(advisorData);
        console.log('Advisor created successfully:', response);
      }
      
             // Step 2: Upload image if selected
       console.log('🔍 Checking image upload conditions:', {
         selectedImage: !!selectedImage,
         responseSuccess: response.success,
         advisorId: response.data?._id
       });
       console.log('🔍 Condition check:', {
         hasSelectedImage: !!selectedImage,
         isResponseSuccess: response.success,
         hasAdvisorId: !!response.data?._id,
         advisorId: response.data?._id
       });
       
       if (selectedImage && response.success && response.data?._id) {
         try {
           const advisorId = response.data._id;
           console.log('🔧 Advisor created with ID:', advisorId);
           console.log('🔧 About to call uploadAdvisorProfileImage...');
           
           // Upload image and update profile
           await AdvisorService.uploadAdvisorProfileImage(advisorId, selectedImage);
           console.log('✅ Image uploaded and profile updated successfully');
           successToast('Profile image uploaded successfully');
         } catch (imageError: any) {
           console.error('Error uploading image:', imageError);
           
           // Extract the actual error message from the image upload response
           let imageErrorMessage = 'Failed to upload image';
           
           if (imageError?.response?.data?.message) {
             imageErrorMessage = imageError.response.data.message;
           } else if (imageError?.message) {
             imageErrorMessage = imageError.message;
           } else if (imageError?.data?.message) {
             imageErrorMessage = imageError.data.message;
           }
           
           // Show error toast for image upload failure
           errorToast(imageErrorMessage);
           // Don't fail the entire process if image upload fails
           // Just log the error and continue
         }
       }
      
      // Show success toast
      successToast(isEditMode ? 'Advisor updated successfully' : 'Advisor added successfully');
      
      // Navigate back to advisors list
      router.push('/advisors');
    } catch (err: any) {
      console.error('Error creating advisor:', err);
      
      // Extract the actual error message from the response
      let errorMessage = 'Failed to create advisor. Please try again.';
      
      // Log the full error structure for debugging
      console.log('Full error object:', err);
      console.log('Error response data:', err?.response?.data);
      console.log('Error message:', err?.message);
      console.log('Error data:', err?.data);
      
      // Check different possible error message locations
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.response?.data) {
        // If the entire response data is a string or has a message
        const responseData = err.response.data;
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      console.log('Final error message to display:', errorMessage);
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching advisor data
  if (isLoadingData) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advisor data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navigation Header */}
      <div className="w-full mb-4 flex items-center justify-between">
        <button
          onClick={handleBackToAdvisors}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Advisors</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Advisor' : 'Add New Advisor'}
        </h1>
      </div>
      
      {/* Left Card */}
      <div className="w-full lg:w-[calc(50%-12px)] float-left mb-6 lg:mb-0">
        <div className="bg-white p-2 sm:p-4 lg:p-8 flex flex-col items-start shadow-sm w-full">
          {/* Picture Upload */}
          <div className="flex flex-col items-center mb-8 self-center">
            <div className="relative w-28 h-28 rounded-full bg-[#F6F6F6] flex flex-col items-center justify-center mb-2 border border-gray-200 overflow-hidden">
              {imagePreview ? (
                <>
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <img src={ICONS.addimage} alt="Add" className="w-8 h-8" />
                  <span className="text-gray-500 text-sm mt-2">Add picture</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {imagePreview ? 'Change picture' : 'Select picture'}
            </label>
          </div>
          {/* Name */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                className="flex-1 border border-gray-200 rounded-[7px] px-6 py-3 text-base font-medium focus:outline-none" 
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
              <input 
                className="flex-1 border border-gray-200 rounded-[7px] px-6 py-3  text-base font-medium focus:outline-none" 
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>
          {/* Email */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              className="w-full border border-gray-200 rounded-[7px] px-6 py-3  text-base font-medium focus:outline-none" 
              placeholder="Write here"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          {/* Phone */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Phone no</label>
            <input 
              className="w-full border border-gray-200 rounded-[7px] px-6 py-3  text-base font-medium focus:outline-none" 
              placeholder="Write here"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>
          {/* Address */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Current Address (Street, City, State, ZIP, Country)</label>
            <input 
              className="w-full border border-gray-200 rounded-[7px] px-6 py-3  text-base font-medium focus:outline-none" 
              placeholder="Write here"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
          {/* DOB */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Date of birth</label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <input
                    className="w-full border border-gray-200 rounded-[7px] px-6 py-3 text-base font-medium focus:outline-none pr-10 bg-white cursor-pointer"
                    placeholder="Jan 10, 2025"
                    value={dob ? format(dob, 'MMM d, yyyy') : ''}
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                    <img src={ICONS.calederDate} alt="calendar" className="w-5 h-5" />
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={dob}
                  onSelect={setDob}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Gender */}
          <div className="w-full mb-2">
            <label className="block text-sm font-medium mb-1">Gender</label>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`border border-gray-200 rounded-[7px] py-2 px-6 focus:outline-none transition-colors duration-150 ${
                    selectedGender === option
                      ? 'bg-[#F5D6C6] text-black font-bold'
                      : 'bg-white text-gray-700 font-medium'
                  }`}
                  onClick={() => setSelectedGender(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Right Card */}
      <div className="w-full lg:w-[calc(50%-12px)] float-right">
        <div className="bg-white p-2 sm:p-4 lg:p-8 shadow-sm w-full lg:w-[750px] flex flex-col">
          <div className="mb-4">
            <span className="block text-lg font-medium mb-4">Socials</span>
            {/* Social Links */}
            <div className="flex flex-col gap-3">
              {/* Instagram */}
              <div className="flex items-center border border-gray-200 rounded-[7px]  px-5 py-4">
                <img src={ICONS.instagram} alt="instagram" className="w-6 h-6 mr-2" />
                <input 
                  className="flex-1 text-sm text-[#0095F6] bg-transparent border-none focus:outline-none" 
                  placeholder="https://instagram.com/username"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                />
                <button className="ml-2 text-gray-400 hover:text-gray-600">✕</button>
              </div>
              {/* Facebook */}
              <div className="flex items-center border border-gray-200 rounded-[7px] px-5 py-4">
                <img src={ICONS.facebook} alt="facebook" className="w-6 h-6 mr-2" />
                <input 
                  className="flex-1 text-sm text-[#1877F3] bg-transparent border-none focus:outline-none" 
                  placeholder="https://facebook.com/username"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                />
                <button className="ml-2 text-gray-400 hover:text-gray-600">✕</button>
              </div>
              {/* Youtube */}
            
              {/* LinkedIn */}
              <div className="flex items-center border border-gray-200 rounded-[7px]  px-5 py-4 ">
                <img src={ICONS.Linkedin} alt="linkedin" className="w-6 h-6 mr-2" />
                <input 
                  className="flex-1 border-none bg-transparent text-sm focus:outline-none" 
                  placeholder="https://linkedin.com/in/username"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                />
              </div>
              {/* TikTok */}
              
            </div>
          </div>
          {/* Other Links */}
          

          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button 
              onClick={handleDiscard}
              disabled={loading}
              className="flex-1 py-3 rounded-[7px] border border-gray-200 bg-white text-black font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Discard
            </button>
            <button 
              onClick={handleAddAdvisor}
              disabled={loading || isLoadingData}
              className="flex-1 py-3 rounded-[7px] bg-[#F5D6C6] text-black font-medium hover:bg-[#E8C4B0] transition-colors disabled:opacity-50"
            >
              {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update advisor' : 'Add advisor')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvisorAdd;
