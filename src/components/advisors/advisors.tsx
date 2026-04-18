"use client";
import React, { useState, useEffect } from "react";
import { Search, Plus, Facebook, Instagram, ArrowRight } from "lucide-react";
import Image from "next/image";
import ICONS from "@/assets/icons";
import { Input } from "../ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdvisorService from "@/services/advisorService";
import { IUser } from "@/types/api";

interface Advisor {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
  };
}

interface AdvisorsProps {
  advisors?: Advisor[];
}

function AdvisorsList({ advisors = [] }: AdvisorsProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [advisorsData, setAdvisorsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch advisors from API
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        setLoading(true);
        // Fetch advisors from dedicated endpoint
        const advisors = await AdvisorService.getAllAdvisors();
        console.log(`Found ${advisors.length} advisors`);
        console.log('Advisors data:', advisors);
        setAdvisorsData(advisors);
      } catch (err) {
        console.error('Error fetching advisors:', err);
        setError('Failed to load advisors');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  // Transform API data to component format
  const transformAdvisorData = (advisor: any): Advisor => {
    console.log('Transforming advisor:', advisor);
    const transformed = {
      id: advisor._id,
      name: `${advisor.firstName} ${advisor.lastName}`,
      title: "Certified Nutritionist & Personal Trainer",
      description: `Hi there! I'm ${advisor.firstName}, a certified nutritionist and personal trainer, and I'm here to help you achieve your fitness goals.`,
      avatar: advisor.profileImage || "/assets/images/advisors.png",
      socialMedia: {
        facebook: advisor.socialLinks?.facebook || undefined,
        instagram: advisor.socialLinks?.instagram || undefined,
      },
    };
    console.log('Transformed advisor:', transformed);
    return transformed;
  };

  // Default advisors data (fallback)
  const defaultAdvisors: Advisor[] = [
    {
      id: "1",
      name: "Sarah Mitchell",
      title: "Certified Nutritionist & Personal Trainer",
      description:
        "Hi there! I'm a certified nutritionist and personal trainer, and I'm more...",
      avatar: "/assets/images/advisors.png",
      socialMedia: {
        facebook: "Sarah_Mitchell",
        instagram: "Sarah_Mitchell123",
      },
    },
    {
      id: "2",
      name: "Alex Buckmaster",
      title: "Certified Nutritionist & Personal Trainer",
      description:
        "Hi there! I'm a certified nutritionist and personal trainer, and I'm more...",
      avatar: "/assets/images/advisors.png",
      socialMedia: {
        facebook: "Alex_Buckmaster",
        instagram: "Alex_Buckmaster",
      },
    },
  ];

  // Use API data if available, otherwise fallback to default
  const displayAdvisors = advisors.length > 0 
    ? advisors 
    : advisorsData.length > 0 
      ? advisorsData.map(transformAdvisorData)
      : defaultAdvisors;

  // Filter advisors based on search term
  const filteredAdvisors = displayAdvisors.filter(
    (advisor) =>
      advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddAdvisor = () => {
    // Navigate to add advisor page
    router.push('/advisors/addAdvisors');
  };

  const handleViewAdvisor = (advisorId: string) => {
    // Navigate to advisor details page
    router.push(`/advisors/details/${advisorId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-darkGray mx-auto mb-4"></div>
          <p className="text-lightGray">Loading advisors...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading advisors</h3>
          <p className="text-lightGray mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-darkGray text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-white p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-darkGray">
            {filteredAdvisors.length} Advisors
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative border border-gray-200 rounded-[5px] px-1">
            <Input
              type="text"
              placeholder="Search advisor..."
              value={searchTerm}
              onChange={handleSearch}
              className=" w-80 px-3 py-2 leading-5 text-sm bg-inherit border-none"
            />
            <div className="absolute inset-y-0 right-3 pl-2 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-lightGray" />
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddAdvisor}
            className="inline-flex items-center rounded-[5px] px-4 py-2 border border-gray-200 text-sm font-medium"
          >
            <Link href="/advisors/addAdvisors">
            <Plus className="h-4 w-4 text-darkGray" />
            </Link>
          </button>
        </div>
      </div>

      {/* Advisors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdvisors.map((advisor) => (
          <div key={advisor.id} className="bg-white p-6">
            {/* Advisor Header */}
            <div className="flex items-start space-x-4 mb-2">
              <div className="flex-shrink-0">
                <Image
                  src={advisor.avatar}
                  alt={advisor.name}
                  width={60}
                  height={60}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-darkGray truncate">
                  {advisor.name}
                </h3>
                <p className="text-sm text-lightGray mt-1">{advisor.title}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 mb-3"></div>

            {/* About Section */}
            <div className="mb-4">
              <h4 className="text-lg font-medium text-darkGray mb-2">About</h4>
              <p className="text-sm text-lightGray leading-relaxed">
                {advisor.description}
              </p>
            </div>

            {/* Social Media Links */}
            <div className="space-y-2 mb-4">
              {advisor.socialMedia.facebook && (
                <div className="flex items-center p-3 gap-2 border border-gray-200 rounded-[5px]">
                  <Image
                    src={ICONS.facebook}
                    alt="facebook"
                    width={25}
                    height={25}
                  />
                  <span className="text-sm text-darkGray">
                    {advisor.socialMedia.facebook}
                  </span>
                </div>
              )}
              {advisor.socialMedia.instagram && (
                <div className="flex items-center p-3 gap-2 border border-gray-200 rounded-[5px]">
                  <Image
                    src={ICONS.instagram}
                    alt="instagram"
                    height={25}
                    width={25}
                  />
                  <span className="text-sm text-gray-700">
                    {advisor.socialMedia.instagram}
                  </span>
                </div>
              )}
              {!advisor.socialMedia.facebook && !advisor.socialMedia.instagram && (
                <div className="text-center py-4">
                  <p className="text-sm text-lightGray">No social media links available</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button 
              className="w-full flex items-center justify-center px-4 py-3 border border-darkGray text-sm font-medium rounded-[5px] bg-white hover:bg-gray-50 transition-colors"
              onClick={() => handleViewAdvisor(advisor.id)}
            >
              <Image src={ICONS.arrow} alt="arrow" width={25} height={25} />
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAdvisors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-lightGray" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No advisors found
          </h3>
          <p className="text-lightGray mb-4">
            {searchTerm
              ? `No advisors match "${searchTerm}"`
              : "No advisors available"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-darkGray text-sm font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdvisorsList;
