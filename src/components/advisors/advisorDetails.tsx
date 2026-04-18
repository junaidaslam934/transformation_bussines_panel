"use client";

import React, { useState, useEffect } from 'react';
import { MoreVertical, Search, ArrowLeft, ArrowRight, Edit } from 'lucide-react';
import ICONS from "@/assets/icons";
import Pagination from '../common/pagination';
import { useRouter } from 'next/navigation';
import AdvisorService from '@/services/advisorService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const assignedUsers = [
  { name: 'Lilly James', date: 'March 12, 2025', avatar: 'L' },
  { name: 'Oliver Smith', date: 'March 13, 2025', avatar: 'O' },
  { name: 'Emma Brown', date: 'March 14, 2025', avatar: 'E' },
  { name: 'Noah Johnson', date: 'March 15, 2025', avatar: 'N' },
  { name: 'Ava Garcia', date: 'March 16, 2025', avatar: 'A' },
  { name: 'Liam Martinez', date: 'March 17, 2025', avatar: 'L' },
  { name: 'Sophia Rodriguez', date: 'March 18, 2025', avatar: 'S' },
  { name: 'Mason Lee', date: 'March 19, 2025', avatar: 'M' },
  { name: 'Isabella Hernandez', date: 'March 20, 2025', avatar: 'I' },
  { name: 'Elijah Wilson', date: 'March 21, 2025', avatar: 'E' },
];

const aboutLines: string[] = [
  "Hi there! I'm a certified nutritionist and personal trainer, and I'm passionate about helping people achieve their health and fitness goals.",
  "With a tailored approach to nutrition and exercise, I work closely with clients to create personalized plans that fit their unique needs and lifestyles.",
  "My goal is to empower you to make sustainable changes for long-term health and well-being.",
  "I believe in a balanced approach that includes both nutrition and physical activity.",
  "Let's work together to achieve your health and fitness goals!"
];

interface AssignedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  currentWeight?: number;
  weightGoal?: number;
  goal?: string;
}

interface DroppedUser {
  _id: string;
  userId: string;
  advisorId: string;
  reason: string;
  createdAt: string;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface AdvisorDetailsProps {
  advisorId?: string;
}

const AdvisorDetails = ({ advisorId }: AdvisorDetailsProps) => {
  const router = useRouter();
  const [userSearch, setUserSearch] = useState('');
  const [droppedSearch, setDroppedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [assignedUsersData, setAssignedUsersData] = useState<AssignedUser[]>([]);
  const [droppedUsersData, setDroppedUsersData] = useState<DroppedUser[]>([]);
  const [totalAssignedUsers, setTotalAssignedUsers] = useState(0);
  const [totalDroppedUsers, setTotalDroppedUsers] = useState(0);
  const [loadingAssignedUsers, setLoadingAssignedUsers] = useState(false);
  const [loadingDroppedUsers, setLoadingDroppedUsers] = useState(false);
  const itemsPerPage = 4;
  const [showMore, setShowMore] = useState(false);
  const [advisorData, setAdvisorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch advisor data when component mounts
  useEffect(() => {
    const fetchAdvisorData = async () => {
      if (!advisorId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching advisor with ID:', advisorId);
        const response = await AdvisorService.getAdvisorById(advisorId);
        console.log('Advisor response:', response);
        
        // Handle different response formats
        let advisorData = null;
        if (response.data) {
          advisorData = response.data;
        } else if (response.success && response.data) {
          advisorData = response.data;
        } else {
          advisorData = response;
        }
        
        console.log('Processed advisor data:', advisorData);
        setAdvisorData(advisorData);
      } catch (err) {
        console.error('Error fetching advisor:', err);
        setError('Failed to load advisor details');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisorData();
  }, [advisorId]);

  // Fetch assigned users when advisorId changes or search changes
  useEffect(() => {
    const fetchAssignedUsers = async () => {
      if (!advisorId) return;

      try {
        setLoadingAssignedUsers(true);
        console.log('Fetching assigned users with search:', userSearch);
        
        const response = await AdvisorService.getAssignedUsers(
          advisorId,
          currentPage,
          itemsPerPage,
          userSearch.trim() // Trim the search term to handle empty strings properly
        );
        
        console.log('Assigned users response:', response);
        
        if (response.success) {
          setAssignedUsersData(response.data || []);
          setTotalAssignedUsers(response.total || 0);
        } else {
          console.error('API returned error for assigned users:', response);
          setAssignedUsersData([]);
          setTotalAssignedUsers(0);
        }
      } catch (err) {
        console.error('Error fetching assigned users:', err);
        setAssignedUsersData([]);
        setTotalAssignedUsers(0);
      } finally {
        setLoadingAssignedUsers(false);
      }
    };

    // Add a small delay to prevent too many API calls while typing
    const timeoutId = setTimeout(() => {
      fetchAssignedUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [advisorId, currentPage, userSearch]);

  // Fetch dropped users when advisorId changes or search changes
  useEffect(() => {
    const fetchDroppedUsers = async () => {
      if (!advisorId) return;

      try {
        setLoadingDroppedUsers(true);
        console.log('Fetching dropped users with search:', droppedSearch);
        
        const response = await AdvisorService.getDroppedUsers(
          advisorId,
          1,
          100, // Get more dropped users since they're displayed in cards
          droppedSearch.trim() // Trim the search term to handle empty strings properly
        );
        
        console.log('Dropped users response:', response);
        
        if (response.success) {
          setDroppedUsersData(response.data || []);
          setTotalDroppedUsers(response.total || 0);
        } else {
          console.error('API returned error for dropped users:', response);
          setDroppedUsersData([]);
          setTotalDroppedUsers(0);
        }
      } catch (err) {
        console.error('Error fetching dropped users:', err);
        setDroppedUsersData([]);
        setTotalDroppedUsers(0);
      } finally {
        setLoadingDroppedUsers(false);
      }
    };

    // Add a small delay to prevent too many API calls while typing
    const timeoutId = setTimeout(() => {
      fetchDroppedUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [advisorId, droppedSearch]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [userSearch, droppedSearch]);

  // Calculate total pages based on API response
  const totalPages = Math.ceil(totalAssignedUsers / itemsPerPage);

  // Scroll lock handler for dropped users list
  const handleDroppedUsersWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const atTop = el.scrollTop === 0 && e.deltaY < 0;
    const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight && e.deltaY > 0;
    if (atTop || atBottom) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleBackToAdvisors = () => {
    router.push('/advisors');
  };

  const handleEditAdvisor = () => {
    if (advisorData?._id) {
      router.push(`/advisors/addAdvisors?edit=true&advisorId=${advisorData._id}`);
    }
  };

  const handleAddNewAdvisor = () => {
    router.push('/advisors/addAdvisors');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get user initials for avatar
  const getUserInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-darkGray mx-auto mb-4"></div>
          <p className="text-lightGray">Loading advisor details...</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading advisor</h3>
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
    <div className="w-full pt-0 px-4 flex flex-col md:flex-row gap-6">
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-6 max-w-5xl h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide">
        {/* Profile + About Card */}
        <div className="bg-white shadow-sm p-4 flex flex-col gap-4 sticky top-0 z-30">
          {/* Profile Card */}
          <div className="flex gap-4 items-center">
            <img 
              src={advisorData?.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"} 
              alt="avatar" 
              className="w-16 h-16 rounded-[7px] object-cover border-2 border-lightBrown" 
            />
            <div className="flex-1">
              <div className="font-semibold text-lg text-gray-800">
                {advisorData ? `${advisorData.firstName} ${advisorData.lastName}` : 'Alex Buckmaster'}
              </div>
              <div className="text-xs text-gray-500">Certified Nutritionist & Personal Trainer</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <MoreVertical size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEditAdvisor} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Advisor</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="border-b border-gray-200 my-2" />
          {/* About Card */}
          <div>
            <span className="font-adelle text-[17px] font-medium text-gray-800 pb-2 block">About</span>
            <div className="font-adelle text-[16px] font-normal text-darkGray leading-[140%] mb-3">
              {aboutLines.slice(0, showMore ? 5 : 3).map((line: string, idx: number) => (
                <span key={idx} className="block mb-1">{line}</span>
              ))}
              {aboutLines.length > 3 && !showMore && (
                <button className="block underline text-[15px] font-medium mt-1" onClick={() => setShowMore(true)}>
                  See more...
                </button>
              )}
            </div>
            {/* Social Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advisorData?.socialLinks?.facebook && (
                <a href={advisorData.socialLinks.facebook} className="flex items-center gap-2 border border-gray-200 rounded-[5px] px-4 py-3 bg-white font-semibold text-sm">
                  <img src={ICONS.facebook} alt="Facebook" className="w-6 h-6" />
                  {advisorData.socialLinks.facebook}
                </a>
              )}
              {advisorData?.socialLinks?.instagram && (
                <a href={advisorData.socialLinks.instagram} className="flex items-center gap-2 border border-gray-200 rounded-[5px] px-4 py-3 bg-white font-semibold text-sm">
                  <img src={ICONS.instagram} alt="Instagram" className="w-6 h-6" />
                  {advisorData.socialLinks.instagram}
                </a>
              )}
              {advisorData?.socialLinks?.linkedin && (
                <a href={advisorData.socialLinks.linkedin} className="flex items-center gap-2 border border-gray-200 rounded-[5px] px-4 py-3 bg-white font-semibold text-sm">
                  <img src={ICONS.Linkedin} alt="LinkedIn" className="w-6 h-6" />
                  {advisorData.socialLinks.linkedin}
                </a>
              )}
              {advisorData?.socialLinks?.tiktok && (
                <a href={advisorData.socialLinks.tiktok} className="flex items-center gap-2 border border-gray-200 rounded-[5px] px-4 py-3 bg-white font-semibold text-sm">
                  <img src={ICONS.tiktok} alt="TikTok" className="w-6 h-6" />
                  {advisorData.socialLinks.tiktok}
                </a>
              )}
              {(!advisorData?.socialLinks?.facebook && !advisorData?.socialLinks?.instagram && !advisorData?.socialLinks?.linkedin && !advisorData?.socialLinks?.tiktok) && (
                <div className="col-span-2 text-center py-4">
                  <p className="text-sm text-lightGray">No social media links available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assigned Users Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col h-[300px]">
          {/* Fixed heading and search */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-adelle text-[17px] font-medium text-gray-800">Assigned users</span>
            <div className="relative w-48">
              <input
                type="text"
                placeholder="User"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6E9DA]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          {/* Scrollable table */}
          <div className="overflow-x-auto flex-1 overflow-y-auto scrollbar-hide">
            <table className="min-w-full bg-white">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="text-darkBrown text-xs">
                  <th className="py-2 px-2 text-left font-medium">User</th>
                  <th className="py-2 px-2 font-medium text-center">Date assigned</th>
                  <th className="py-2 px-2 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingAssignedUsers ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-darkGray mx-auto"></div>
                      <p className="text-lightGray text-sm mt-2">Loading users...</p>
                    </td>
                  </tr>
                ) : assignedUsersData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center">
                      <p className="text-lightGray text-sm">No assigned users found</p>
                    </td>
                  </tr>
                ) : (
                  assignedUsersData.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 text-sm">
                      <td className="py-2 px-2 flex items-center gap-2">
                        <span className="w-9 h-9 rounded-full bg-lightBrown flex items-center justify-center font-medium text-black text-base">
                          {getUserInitials(user.firstName, user.lastName)}
                        </span>
                        <span className="font-adelle text-darkGray text-base">
                          {user.firstName} {user.lastName}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center text-lightGray">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button className="p-1 rounded-ful text-lightGray hover:bg-gray-100">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination below the scrollable area */}
          {totalAssignedUsers > 0 && (
            <div className="mt-2 flex justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalAssignedUsers}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showInfo={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col gap-4 min-w-[340px] h-[calc(100vh-64px)]">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4 h-full">
          {/* Sticky heading and search */}
          <div className="sticky top-0 z-20 bg-white pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-adelle text-[17px] font-medium text-gray-800">Dropped users</span>
              <div className="relative w-48">
                <input
                  type="text"
                  placeholder="Search User..."
                  value={droppedSearch}
                  onChange={e => setDroppedSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6E9DA]"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>
          {/* Scrollable dropped users list */}
          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-3 pr-1" onWheel={handleDroppedUsersWheel}>
            {loadingDroppedUsers ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-darkGray mx-auto mb-2"></div>
                  <p className="text-lightGray text-sm">Loading dropped users...</p>
                </div>
              </div>
            ) : droppedUsersData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lightGray text-sm">No dropped users found</p>
              </div>
            ) : (
              droppedUsersData.map((user) => (
                <div key={user._id} className="bg-white border border-gray-200 rounded-[7px] p-5 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="w-14 h-14 rounded-[10px] bg-lightBrown flex items-center justify-center font-medium text-black text-2xl">
                      {getUserInitials(user.userInfo.firstName, user.userInfo.lastName)}
                    </span>
                    <div>
                      <div className="font-adelle text-lg font-semibold text-black">
                        {user.userInfo.firstName} {user.userInfo.lastName}
                      </div>
                      <div className="text-xs text-lightGray mt-1">
                        Dropped on: {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 my-4" />
                  <div className="font-adelle text-base font-semibold text-black mb-2">Reason</div>
                  <div className="text-lightGray text-base">
                    {user.reason.length > 100 ? (
                      <>
                        {user.reason.substring(0, 100)}...
                        <a href="#" className="underline ml-1">see more...</a>
                      </>
                    ) : (
                      user.reason
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDetails;
