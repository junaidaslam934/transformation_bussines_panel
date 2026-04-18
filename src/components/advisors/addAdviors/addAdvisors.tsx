"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Camera, Instagram, Facebook, Youtube, Linkedin, X } from "lucide-react";
import Image from "next/image";
import { FaTiktok } from "react-icons/fa6";
import { errorToast, successToast } from "@/lib/toasts";
import AdvisorService from "@/services/advisorService";
import { useRouter } from "next/navigation";

interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
  other: string;
}

interface AdvisorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  profileImage: File | null;
  socialLinks: SocialLinks;
}

interface FieldError {
  field: string;
  message: string;
}

export default function AddForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdvisorFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    profileImage: null,
    socialLinks: {
      instagram: "",
      facebook: "",
      youtube: "",
      linkedin: "",
      tiktok: "",
      other: ""
    }
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldError, setFieldError] = useState<FieldError | null>(null);
  const [showError, setShowError] = useState<boolean>(true); // For demonstration purposes only

  const handleInputChange = (field: keyof AdvisorFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldError(null);
    
    // Basic validation
    if (!formData.firstName.trim()) {
      setFieldError({ field: "firstName", message: "First name is required" });
      errorToast("First name is required");
      setLoading(false);
      return;
    }
    
    if (!formData.lastName.trim()) {
      setFieldError({ field: "lastName", message: "Last name is required" });
      errorToast("Last name is required");
      setLoading(false);
      return;
    }
    
    if (!formData.email.trim()) {
      setFieldError({ field: "email", message: "Email is required" });
      errorToast("Email is required");
      setLoading(false);
      return;
    }
    
    try {
      // For demonstration purposes, we'll use the toggle button to simulate success/error
      if (showError) {
        // Simulate validation error
        const errorField = "dateOfBirth";
        const errorMessage = "Date of birth cannot be in the future";
        setFieldError({ field: errorField, message: errorMessage });
        errorToast(errorMessage);
      } else {
        // Prepare advisor data for API submission
      const advisorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        cognitoId: "", // This would typically come from authentication
        socialLinks: {
          facebook: formData.socialLinks.facebook,
          instagram: formData.socialLinks.instagram,
          linkedin: formData.socialLinks.linkedin,
          tiktok: formData.socialLinks.tiktok,
          youtube: formData.socialLinks.youtube,
          other: formData.socialLinks.other
        }
      };
      
      try {
        // For demo purposes, we'll just show a success toast without making the actual API call
        // In production, uncomment the following line:
        // const response = await AdvisorService.createAdvisor(advisorData);
        
        // Display success toast
        successToast("Advisor added successfully");
        
        // Reset form and navigate to advisors list
        handleDiscard();
        router.push("/advisors");
      } catch (apiError: any) {
        // This would handle errors from the actual API call
        errorToast(apiError.message || "Failed to add advisor");
      }
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      
      // Handle API error response
      if (error.response && error.response.data) {
        const { field, message } = error.response.data.error || {};
        if (field && message) {
          // Set field-specific error
          setFieldError({ field, message });
          // Display toast with the error message
          errorToast(message);
        } else if (error.response.data.message) {
          // Display toast with the general error message from the API
          errorToast(error.response.data.message);
        } else {
          // Fallback error message
          errorToast("Failed to add advisor");
        }
      } else if (error.message) {
        // Display toast with the error message from the Error object
        errorToast(error.message);
      } else {
        // Generic error message as a last resort
        errorToast("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    // Reset form data
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      profileImage: null,
      socialLinks: {
        instagram: "",
        facebook: "",
        youtube: "",
        linkedin: "",
        tiktok: "",
        other: ""
      }
    });
    
    // Clear image preview
    setImagePreview(null);
    
    // Clear any field errors
    setFieldError(null);
    
    // Reset loading state (just in case)
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Personal Information */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 ${fieldError?.field === "profileImage" ? "border-red-500" : "border-gray-200"}`}>
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <Label className="text-sm text-gray-600 cursor-pointer">
                Add picture
              </Label>
              {fieldError?.field === "profileImage" && (
                <p className="text-red-500 text-xs">{fieldError.message}</p>
              )}
            </div>

            {/* Name Fields */}
            <div className="space-y-4">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`${fieldError?.field === "firstName" ? "border-red-500" : ""}`}
                />
                {fieldError?.field === "firstName" && (
                  <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                )}
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`${fieldError?.field === "lastName" ? "border-red-500" : ""}`}
                />
                {fieldError?.field === "lastName" && (
                  <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`${fieldError?.field === "email" ? "border-red-500" : ""}`}
              />
              {fieldError?.field === "email" && (
                <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone no
              </Label>
              <Input
                id="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`${fieldError?.field === "phone" ? "border-red-500" : ""}`}
              />
              {fieldError?.field === "phone" && (
                <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Current Address (Street, City, State, ZIP, Country)
              </Label>
              <Input
                id="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`${fieldError?.field === "address" ? "border-red-500" : ""}`}
              />
              {fieldError?.field === "address" && (
                <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                Date of birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                placeholder="YYYY-MM-DD"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className={`${fieldError?.field === "dateOfBirth" ? "border-red-500" : ""}`}
              />
              {fieldError?.field === "dateOfBirth" && (
                <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Gender</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={formData.gender === "Male" ? "default" : "outline"}
                  onClick={() => handleInputChange("gender", "Male")}
                  className="px-6"
                >
                  Male
                </Button>
                <Button
                  type="button"
                  variant={formData.gender === "Female" ? "default" : "outline"}
                  onClick={() => handleInputChange("gender", "Female")}
                  className="px-6 bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200"
                >
                  Female
                </Button>
              </div>
              {fieldError?.field === "gender" && (
                <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
              )}
            </div>
          </div>

          {/* Right Column - Social Media */}
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium text-gray-900 mb-4 block">
                Socials
              </Label>
              
              <div className="space-y-4">
                {/* Instagram */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    <Instagram className="w-5 h-5 text-pink-500" />
                  </div>
                  <Input
                    placeholder="instagram.com/username"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                    className={`flex-1 ${fieldError?.field === "socialLinks.instagram" ? "border-red-500" : ""}`}
                  />
                  {fieldError?.field === "socialLinks.instagram" && (
                    <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                  )}
                  <Button type="button" variant="ghost" size="sm">
                    ×
                  </Button>
                </div>

                {/* Facebook */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </div>
                  <Input
                    placeholder="facebook.com/username"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                    className={`flex-1 ${fieldError?.field === "socialLinks.facebook" ? "border-red-500" : ""}`}
                  />
                  {fieldError?.field === "socialLinks.facebook" && (
                    <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                  )}
                  <Button type="button" variant="ghost" size="sm">
                    ×
                  </Button>
                </div>

                {/* YouTube */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    <Youtube className="w-5 h-5 text-red-600" />
                  </div>
                  <Input
                    placeholder="youtube.com/channel/username"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                    className={`flex-1 ${fieldError?.field === "socialLinks.youtube" ? "border-red-500" : ""}`}
                  />
                  {fieldError?.field === "socialLinks.youtube" && (
                    <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                  )}
                  <Button type="button" variant="ghost" size="sm">
                    ×
                  </Button>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                  </div>
                  <Input
                    placeholder="linkedin.com/in/username"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                    className={`flex-1 ${fieldError?.field === "socialLinks.linkedin" ? "border-red-500" : ""}`}
                  />
                  {fieldError?.field === "socialLinks.linkedin" && (
                    <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                  )}
                  <Button type="button" variant="ghost" size="sm">
                    ×
                  </Button>
                </div>

                {/* TikTok */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    <FaTiktok className="w-5 h-5 text-black" />
                  </div>
                  <Input
                    placeholder="tiktok.com/@username"
                    value={formData.socialLinks.tiktok}
                    onChange={(e) => handleSocialLinkChange("tiktok", e.target.value)}
                    className={`flex-1 ${fieldError?.field === "socialLinks.tiktok" ? "border-red-500" : ""}`}
                  />
                  {fieldError?.field === "socialLinks.tiktok" && (
                    <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                  )}
                  <Button type="button" variant="ghost" size="sm">
                    ×
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Other */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Other link</Label>
                <Input
                  placeholder="Other social media link"
                  value={formData.socialLinks.other}
                  onChange={(e) => handleSocialLinkChange("other", e.target.value)}
                  className={`w-full ${fieldError?.field === "socialLinks.other" ? "border-red-500" : ""}`}
                />
                {fieldError?.field === "socialLinks.other" && (
                  <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          {/* Toggle button for demonstration purposes only */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowError(!showError)}
            className="px-4 text-xs"
          >
            Demo: Toggle Success/Error Mode
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            className="px-8"
          >
            Discard
          </Button>
          <Button
            type="submit"
            className="px-8 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add advisor"}
          </Button>
        </div>
      </form>
    </div>
  );
}
