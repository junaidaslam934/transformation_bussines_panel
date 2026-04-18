"use client";
import ICONS from "@/assets/icons";
import { Calendar, MoreHorizontal, MoreVertical, Search, X, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";

import { Progress } from "@/components/ui/progress";
import { participant } from "@/utils/challenge";
import { ChallengeFormData } from "@/utils/challenge";
import { Button } from "../ui/button";
import Pagination from "../common/pagination";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';


import RichTextEditor from "@/components/ui/rich-text-editor";
import DrawerModal from "@/components/DrawerModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import ChallengeService from "@/services/challengeService";
import { errorToast, successToast } from "@/lib/toasts";

// Default fallback data when no active challenge exists
const defaultChallenge = {
  title: "No Active Challenge",
  startDate: "",
  endDate: "",
  image: ICONS.challengepic,
  progress: 0,
  totalParticipants: 0,
  activeParticipants: 0,
  daysRemaining: 0,
};

const participants: string | any[] = [
  {
    id: 1,
    rank: 1,
    avatar: "A",
    name: "Alice Smith",
    advisor: "John Doe",
    subscription: "Gold",
    progress: 80,
  },
  {
    id: 2,
    rank: 2,
    avatar: "B",
    name: "Bob Johnson",
    advisor: "Jane Roe",
    subscription: "Silver",
    progress: 65,
  },
  {
    id: 3,
    rank: 3,
    avatar: "C",
    name: "Charlie Brown",
    advisor: "John Doe",
    subscription: "Bronze",
    progress: 50,
  },
  {
    id: 4,
    rank: 4,
    avatar: "D",
    name: "Diana Prince",
    advisor: "Jane Roe",
    subscription: "Gold",
    progress: 40,
  },
  {
    id: 5,
    rank: 5,
    avatar: "E",
    name: "Evan Wright",
    advisor: "John Doe",
    subscription: "Silver",
    progress: 30,
  },
  {
    id: 6,
    rank: 6,
    avatar: "F",
    name: "Fiona Lee",
    advisor: "Jane Roe",
    subscription: "Bronze",
    progress: 20,
  }
];

const ActiveChallenge = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [declaringWinner, setDeclaringWinner] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<ChallengeFormData>();

  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Use watch to get form values
  const watchedTitle = watch('title');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  // Fetch active challenge data
  const fetchActiveChallenge = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ChallengeService.getActiveChallenge();
      
      if (response.success && response.data) {
        setActiveChallenge(response.data);
      } else {
        setActiveChallenge(null);
      }
    } catch (err: any) {
      console.error('Error fetching active challenge:', err);
      const errorMessage = err.message || 'Failed to fetch active challenge';
      setError(errorMessage);
      errorToast(errorMessage);
      setActiveChallenge(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  React.useEffect(() => {
    fetchActiveChallenge();
  }, []);

  // Calculate derived values from API data
  const challengeData = activeChallenge ? {
    title: activeChallenge.title,
    startDate: activeChallenge.startDate,
    endDate: activeChallenge.endDate,
    image: activeChallenge.challengeImage || ICONS.challengepic,
    progress: activeChallenge.progress,
    totalParticipants: activeChallenge.users?.length || 0,
    activeParticipants: activeChallenge.users?.length || 0, // All users are active since they're in the challenge
    daysRemaining: activeChallenge.endDate ? Math.max(0, Math.ceil((new Date(activeChallenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0,
  } : defaultChallenge;

  // Add a helper to check if all required fields are filled
  const isFormComplete = !!(
    watchedTitle &&
    watchedStartDate &&
    watchedEndDate &&
    description
    // Removed uploadedFile requirement
  );

  const editor = useEditor({
    extensions: [StarterKit, Underline, Superscript, Subscript],
    content: '',
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  const onSubmit = async (data: ChallengeFormData) => {
    try {
      setImageUploading(true);
      const submitData = {
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        description,
      };
      
      console.log("Submitted:", submitData);
      console.log("Uploaded file:", uploadedFile);
      console.log("File details:", uploadedFile ? {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type
      } : "No file");
      
      console.log("About to call ChallengeService.createChallenge...",uploadedFile);
      console.log("ChallengeService type:", typeof ChallengeService);
      console.log("ChallengeService.createChallenge type:", typeof ChallengeService.createChallenge);
      // Create the challenge with image upload handled by the service
      const response = await ChallengeService.createChallenge(submitData, uploadedFile || undefined);
      console.log("ChallengeService.createChallenge completed,");
      
      if (response.success) {
        console.log("Challenge created successfully");
        successToast("Challenge created successfully!");
        
        // Success - reset form and close modal
        reset();
        setDescription("");
        setUploadedFile(null);
        setIsModalOpen(false);
        
        // Refresh the active challenge data to show the new challenge
        await fetchActiveChallenge();
      } else {
        const errorMessage = response.message || 'Failed to create challenge';
        errorToast(errorMessage);
      }
      
    } catch (err: any) {
      console.error('Error creating challenge:', err);
      
      // Extract the actual error message from the response
      let errorMessage = 'Failed to create challenge. Please try again.';
      
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
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [participantPage, setParticipantPage] = useState(1);
  const perParticipantPage = 5;
  
  // Extract users from the nested structure
  const participants = activeChallenge?.users?.map((item: any) => item.user) || [];
  const totalParticipantPages = Math.ceil(participants.length / perParticipantPage);
  const paginatedParticipants = participants.slice(
    (participantPage - 1) * perParticipantPage,
    participantPage * perParticipantPage
  );

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset so onChange always fires
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {0
    console.log("File changed:", e.target.files);
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDeclareWinner = async (userId: string) => {
    try {
      setDeclaringWinner(userId);
      
      const response = await ChallengeService.declareWinner(userId, activeChallenge._id);
      
      if (response.success) {
        successToast("Winner declared successfully!");
        // Refresh the challenge data to show the updated winner
        await fetchActiveChallenge();
      } else {
        const errorMessage = response.message || 'Failed to declare winner';
        errorToast(errorMessage);
      }
    } catch (err: any) {
      console.error('Error declaring winner:', err);
      const errorMessage = err.message || 'Failed to declare winner';
      errorToast(errorMessage);
    } finally {
      setDeclaringWinner(null);
    }
  };

  const handleEndChallenge = async () => {
    try {
      const response = await ChallengeService.endActiveChallenge(activeChallenge._id);
      
      if (response.success) {
        successToast("Challenge ended successfully!");
        // Refresh the challenge data
        await fetchActiveChallenge();
      } else {
        const errorMessage = response.message || 'Failed to end challenge';
        errorToast(errorMessage);
      }
    } catch (err: any) {
      console.error('Error ending challenge:', err);
      const errorMessage = err.message || 'Failed to end challenge';
      errorToast(errorMessage);
    }
  };

  const handleEditChallenge = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: ChallengeFormData) => {
    try {
      const submitData = {
        title: data.title,
        description,
      };
      
      console.log("Editing challenge:", submitData);
      
      const response = await ChallengeService.updateChallenge(activeChallenge._id, submitData, uploadedFile || undefined);
      
      if (response.success) {
        successToast("Challenge updated successfully!");
        await fetchActiveChallenge();
        setIsEditModalOpen(false);
        reset();
        setDescription("");
        setUploadedFile(null);
      } else {
        const errorMessage = response.message || 'Failed to update challenge';
        errorToast(errorMessage);
      }
      
    } catch (err: any) {
      console.error('Error editing challenge:', err);
      
      // Extract the actual error message from the response
      let errorMessage = 'Failed to update challenge. Please try again.';
      
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
    }
  };

  // Hidden file input for image upload (must be outside the form)
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/png"
      style={{ display: "none" }}
      onChange={handleFileChange}
      tabIndex={-1}
    />
  );

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading challenge data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading challenge: {error}</p>
          <Button 
            onClick={fetchActiveChallenge}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {activeChallenge ? (
        <div className="flex flex-col gap-6">
          {/* ... keep existing code (top section and cards) */}
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="w-full lg:max-w-[512px] border border-gray-200 bg-white p-4 pt-4 pb-0 shadow-sm">
              <div className="flex flex-row items-center justify-between mb-4">
                <h1 className="font-adelle text-[20px] text-darkGray font-semibold">Active Challenge</h1>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-6 h-6 text-darkGray cursor-pointer" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2 bg-white" align="end">
                    <div className="space-y-1">
                      <button
                        onClick={handleEditChallenge}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Challenge
                      </button>
                      <button
                        onClick={handleEndChallenge}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        End Challenge
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-full bg-white rounded-lg mb-4 overflow-hidden">
                <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/9]">
                  <img
                    src={challengeData.image}
                    alt="Challenge Icon"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      // Fallback to default image if the uploaded image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = ICONS.challengepic;
                    }}
                  />
                  {/* Optional overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </div>
              </div>


              <div className="flex justify-between items-start mb-3 flex-col sm:flex-row gap-2 pt-4">
                <div>
                  <h2 className="text-xs text-gray-500">Challenge</h2>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">
                    {challengeData.title}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <h2 className="text-xs text-gray-500 mr-20">Duration</h2>
                  <div className="flex items-center gap-1 mt-0.5 text-sm font-medium text-gray-800">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(challengeData.startDate).toLocaleDateString()} – {new Date(challengeData.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-0 pt-2 pb-4">
                <p className="text-xs text-lightGray mb-1">Progress</p>
                <Progress
                  value={challengeData.progress}
                  className="h-2 bg-gray-200 [&>div]:bg-black"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              {[
                { label: "Total Participants", icon: ICONS.participants, value: challengeData.totalParticipants },
                { label: "Active participants", icon: ICONS.checkcircle, value: challengeData.activeParticipants },
                { label: "Days remaining", icon: ICONS.daysremaing, value: challengeData.daysRemaining },
              ].map((card, i) => (
                <div
                  key={i}
                  className="flex flex-col w-full min-w-[220px] h-[128px] p-4 gap-[10px] bg-white rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-[17px]  text-ceraPro text-darkGray">{card.label}</h2>
                    <img src={card.icon} alt="icon" className="w-5 h-5" />
                  </div>
                  <p className="font-adelle font-semibold text-[20px] leading-[100%] text-darkGray mb-[2px]" style={{letterSpacing: 0}}>{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ... keep existing code (participants table) */}
          <div className="mt-10 w-full max-w-full  mx-auto bg-white p-4 md:p-6 rounded-lg shadow-sm overflow-x-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="font-adelle font-semibold text-[20px] leading-[100%] text-darkGray mb-[2px]" >{participants.length} Participants</h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search User"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-[8px] bg-white w-full"
                />
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="min-w-[600px] md:min-w-full table-auto">
                <thead>
                  <tr className="bg-white-100">
                    <th className="font-ceraPro font-medium text-[20px]  text-darkGray text-left px-2 md:px-4 py-2" style={{letterSpacing: 0}}>Rank</th>
                    <th className="font-ceraPro font-medium text-[20px] leading-[140%] text-darkGray text-left px-2 md:px-4 py-2" style={{letterSpacing: 0}}>Participants</th>
                    <th className="font-ceraPro font-medium text-[20px] leading-[140%] text-darkGray text-left px-2 md:px-4 py-2" style={{letterSpacing: 0}}>Assigned Advisor</th>
                    <th className="font-ceraPro font-medium text-[20px] leading-[140%] text-darkGray text-left px-2 md:px-4 py-2" style={{letterSpacing: 0}}>Subscription Type</th>
                    <th className="font-ceraPro font-medium text-[20px] leading-[140%] text-darkGray text-left px-2 md:px-4 py-2" style={{letterSpacing: 0}}>Progress</th>
                    <th  className="font-ceraPro font-medium text-[20px] leading-[140%] text-darkGray text-left px-2 md:px-4 py-2" style={{letterSpacing: 0}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedParticipants.map((user: any, idx: number) => {
                    const isWinner = activeChallenge?.winner?._id === user._id;
                    const hasWinner = !!activeChallenge?.winner;
                    console.log('User:', user.firstName, user.lastName, 'isWinner:', isWinner, 'hasWinner:', hasWinner, 'winner ID:', activeChallenge?.winner?._id, 'user ID:', user._id);
                    return (
                      <tr key={user._id || user.id} className={`${idx !== paginatedParticipants.length - 1 ? 'border-b' : ''} hover:bg-gray-50`}>
                        <td className="font-ceraPro font-medium text-[20px] leading-[140%] text-darkGray text-left px-2 md:px-4 py-2" style={{letterSpacing: 0}}>{idx + 1}</td>
                        <td className="px-2 md:px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-lightBrown rounded-full flex items-center justify-center text-black-800 font-medium relative">
                              {user.firstName?.[0] || 'U'}
                              {isWinner && (
                                <Crown className="absolute -top-1 -right-1 w-4 h-4 text-lightGray fill-lightBrown" />
                              )}
                            </div>
                            <div className="ml-2 md:ml-3 flex items-center gap-2">
                              <span className="text-lightGray text-xs md:text-base">
                                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                              </span>
                              {isWinner && (
                                <span className="text-lightGray text-xs font-medium bg-lightBrown bg-opacity-20 px-2 py-1 rounded-full">
                                  Winner
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-3 text-lightGray text-xs md:text-base">{user.advisor?.firstName ? `${user.advisor.firstName} ${user.advisor.lastName}` : 'Unassigned'}</td>
                        <td className="px-2 md:px-4 py-3 text-lightGray text-xs md:text-base">{user.subscription || 'Basic'}</td>
                        <td className="px-2 md:px-4 py-3 text-gray-600">
                          <div className="w-[80px] md:w-[150px]">
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-black transition-all"
                                style={{ width: `${user.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-3 text-gray-600">
                          {isWinner ? (
                            <div className="flex items-center justify-center w-6 h-6 mx-auto overflow-hidden">
                              <Crown className="w-4 h-4 text-lightBrown fill-lightBrown" />
                            </div>
                          ) : hasWinner ? (
                            // If there's already a winner, show nothing in action column for non-winners
                            <div></div>
                          ) : (
                            // Only show action menu if there's no winner yet
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <MoreVertical className="h-4 w-4 text-gray-500" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48 p-2" align="end">
                                <button
                                  onClick={() => handleDeclareWinner(user._id)}
                                  disabled={declaringWinner === user._id}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Crown className="w-4 h-4 text-lightBrown" />
                                  {declaringWinner === user._id ? 'Declaring...' : 'Declare Winner'}
                                </button>
                              </PopoverContent>
                            </Popover>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

           
          </div>
          <div className="flex justify-end w-full mt-2 mb-8 md:mb-12">
              <Pagination
                currentPage={participantPage}
                totalPages={totalParticipantPages}
                totalItems={participants.length}
                itemsPerPage={perParticipantPage}
                onPageChange={setParticipantPage}
                itemName="participants"
                showInfo={false}
              />
            </div>

        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-4 gap-4">
          <span className="font-adelle text-[20px] font-medium text-gray-800 pb-6">Active Challenge </span>

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-9 py-6 border border-darkGray rounded text-sm text-gray-700 hover:bg-gray-100 bg-white"
            >
              <span className="text-darkGray text-[15px]">Create Challenge</span>
               <img src={ICONS.plus} alt="plus" className="" />
            </Button>
          </div>

          <div className="flex flex-col justify-center items-center h-full p-10 md:p-20">
            <img
              src={ICONS.nodata}
              alt="No Data Icon"
              className="h-24 w-auto object-cover mb-4"
            />
            <p className="font-ceraPro font-medium text-[16px] leading-[100%] text-lightGray" style={{letterSpacing: 0}}>No active challenge</p>
          </div>
        </div>
      )}

      {/* Custom Modal */}
      {/* Render the hidden file input outside the form to prevent form reset on file selection */}
      {fileInput}
      <DrawerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title=""
        widthClassName="!w-[320px] md:!w-[400px] lg:!w-[700px]"
      >
        {/* Custom header: Add Details left, cross right */}
        <div className="flex flex-row items-center justify-between px-2 py-2  mb-4">
          <span className=" pl-2 font-adelle text-[25px] font-semibold text-gray-800">Add Details</span>
          <button
            onClick={() => setIsModalOpen(false)}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-300 ml-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 px-6">
          {/* Title Field */}
          <div className="flex flex-col gap-2 ">
            <label className="font-adelle text-[20px] font-medium text-gray-800">Title</label>
            <Input
              {...register('title')}
              type="text"
              placeholder="Write here..."
              className="w-full px-4 py-7 border border-lightGray rounded-[7px] text-sm placeholder-lightGray bg-white outline-none focus:ring-0 focus:border-lightGray"
            />
          </div>
          {/* Duration Section */}
          <div className="flex flex-col gap-2">
            <label className="font-adelle text-[20px] font-medium text-gray-800">Duration</label>
            <div className="flex flex-col gap-4 w-full">
              {/* Start Date */}
              <div className="flex flex-col gap-1 w-full">
                <label className="font-adelle text-[15px] font-medium text-lightGray">Start</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative cursor-pointer">
                      <input
                        type="text"
                        readOnly
                        placeholder="Select "
                        value={watchedStartDate ? format(new Date(watchedStartDate), "MM/dd/yyyy") : ""}
                        className="w-full px-4 py-5 border border-lightGray rounded-[7px] text-sm placeholder-lightGray bg-white outline-none focus:ring-0 focus:border-lightGray cursor-pointer"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <DatePickerCalendar
                      mode="single"
                      selected={watchedStartDate ? new Date(watchedStartDate) : undefined}
                      onSelect={date => setValue('startDate', date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* End Date */}
              <div className="flex flex-col gap-1 w-full">
                <label className="font-adelle text-[15px] font-medium text-lightGray">End</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative cursor-pointer">
                      <input
                        type="text"
                        readOnly
                        placeholder="Select"
                        value={watchedEndDate ? format(new Date(watchedEndDate), "MM/dd/yyyy") : ""}
                        className="w-full px-4 py-5 border border-lightGray rounded-[7px] text-sm placeholder-lightGray bg-white outline-none focus:ring-0 focus:border-lightGray cursor-pointer"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <DatePickerCalendar
                      mode="single"
                      selected={watchedEndDate ? new Date(watchedEndDate) : undefined}
                      onSelect={date => setValue('endDate', date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          {/* Description Field */}
          <div className="flex flex-col gap-2">
            <label className="font-adelle text-[20px] font-medium text-gray-800">Description</label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Write here..."
              minHeight="120px"
              showToolbar={true}
              onImageUpload={handleImageUpload}
              className="placeholder-lightGray"
            />
          </div>
          {uploadedFile && (
            <div className="mt-2 border rounded-[7px] overflow-hidden bg-gray-50">
              {/* Image Preview */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[3/2]">
                <img 
                  src={URL.createObjectURL(uploadedFile)} 
                  alt="Preview" 
                  className="w-full h-full object-cover object-center"
                />
                {/* Overlay with file info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <img src={ICONS.imageveiw} alt="preview" className="w-4 h-4 object-contain" />
                      <span className="text-sm font-medium truncate max-w-[120px]">{uploadedFile.name}</span>
                      <span className="text-xs opacity-75">{(uploadedFile.size / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                    <button
                      className="text-white hover:text-red-300 transition-colors p-1"
                      onClick={() => setUploadedFile(null)}
                      aria-label="Remove"
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Button
            type="submit"
            className={`w-full py-3 px-4 font-semibold rounded-lg shadow transition-colors duration-200 text-base mt-2
              ${isFormComplete
                ? 'bg-lightBrown text-black hover:bg-lightBrown border border-transparent'
                : 'bg-white text-black border border-lightGray cursor-not-allowed'}
            `}
            disabled={!isFormComplete || imageUploading}
          >
            {imageUploading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              'Publish'
            )}
          </Button>
        </form>
      </DrawerModal>

      {/* Edit Challenge Modal */}
      <DrawerModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title=""
        widthClassName="!w-[320px] md:!w-[400px] lg:!w-[700px]"
      >
        {/* Custom header: Edit Details left, cross right */}
        <div className="flex flex-row items-center justify-between px-2 py-2 mb-4">
          <span className="pl-2 font-adelle text-[25px] font-semibold text-gray-800">Edit Details</span>
          <button
            onClick={() => setIsEditModalOpen(false)}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-700 transition-colors raounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-300 ml-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit(handleEditSubmit)} className="flex flex-col gap-6 px-6">
          {/* Title Field */}
          <div className="flex flex-col gap-2">
            <label className="font-adelle text-[20px] font-medium text-gray-800">Title</label>
            <Input
              {...register('title')}
              type="text"
              placeholder="Write here..."
              defaultValue={activeChallenge?.title || ""}
              className="w-full px-4 py-7 border border-lightGray rounded-[7px] text-sm placeholder-lightGray bg-white outline-none focus:ring-0 focus:border-lightGray"
            />
          </div>
          {/* Duration Section - Read Only */}
          <div className="flex flex-col gap-2">
            <label className="font-adelle text-[20px] font-medium text-gray-800">Duration</label>
            <div className="flex flex-col gap-4 w-full">
              {/* Start Date */}
              <div className="flex flex-col gap-1 w-full">
                <label className="font-adelle text-[15px] font-medium text-lightGray">Start</label>
                <div className="w-full px-4 py-5 border border-lightGray rounded-[7px] text-sm bg-gray-50 text-gray-600">
                  {activeChallenge?.startDate ? format(new Date(activeChallenge.startDate), "MM/dd/yyyy") : "Not set"}
                </div>
              </div>
              {/* End Date */}
              <div className="flex flex-col gap-1 w-full">
                <label className="font-adelle text-[15px] font-medium text-lightGray">End</label>
                <div className="w-full px-4 py-5 border border-lightGray rounded-[7px] text-sm bg-gray-50 text-gray-600">
                  {activeChallenge?.endDate ? format(new Date(activeChallenge.endDate), "MM/dd/yyyy") : "Not set"}
                </div>
              </div>
            </div>
          </div>
          {/* Description Field */}
          <div className="flex flex-col gap-2">
            <label className="font-adelle text-[20px] font-medium text-gray-800">Description</label>
            <RichTextEditor
              content={activeChallenge?.description || ""}
              onChange={setDescription}
              placeholder="Write here..."
              minHeight="120px"
              showToolbar={true}
              onImageUpload={handleImageUpload}
              className="placeholder-lightGray"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-3 px-4 font-semibold rounded-lg shadow transition-colors duration-200 text-base mt-2 bg-lightBrown text-black hover:bg-lightBrown border border-transparent"
            disabled={imageUploading}
          >
            {imageUploading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>Updating...</span>
              </div>
            ) : (
              'Update Challenge'
            )}
          </Button>
        </form>
      </DrawerModal>
    </>
  );
};

export default ActiveChallenge;
