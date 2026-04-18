"use client";
import { Calendar, Users, CheckCircle } from "lucide-react";
import Image from "next/image";
import ICONS from "@/assets/icons";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar as ShadCalendar } from "../ui/calendar";
import { format } from "date-fns";
import ChallengeService from "@/services/challengeService";
import { useRouter } from "next/navigation";

interface ActiveChallengeData {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  challengeImage: string | null;
  progress: number;
  users: any[];
  winner: any | null;
}

interface ActiveChallengeProps {
  challenge?: ActiveChallengeData;
}

function ActiveChallenge({ challenge }: ActiveChallengeProps) {
  const router = useRouter();
  const [activeChallenge, setActiveChallenge] = useState<ActiveChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(err.message);
      setActiveChallenge(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchActiveChallenge();
  }, []);

  // Calculate derived values from API data
  const challengeData = activeChallenge ? {
    title: activeChallenge.title,
    duration: `${format(new Date(activeChallenge.startDate), "MMM d, yyyy")} - ${format(new Date(activeChallenge.endDate), "MMM d, yyyy")}`,
    totalParticipants: activeChallenge.users?.length || 0,
    activeParticipants: activeChallenge.users?.length || 0, // All users are active since they're in the challenge
  } : null;

  // Calendar popover state
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [open, setOpen] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading challenge data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white p-6">
        <div className="text-center">
          <p className="text-red-600 mb-2 text-sm">Error loading challenge: {error}</p>
          <Button 
            onClick={fetchActiveChallenge}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Show no challenge state
  if (!challengeData) {
    return (
      <div className="bg-white p-6">
        <div className="text-center">
          <p className="text-gray-500 text-sm">No active challenge</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-darkGray">
          Active Challenge
        </h3>
        <Button 
  onClick={() => router.push('/challenge-managment/activechallengs')}
  className="text-sm text-darkGray transition-colors underline"
>
  View Complete Details
</Button>
      </div>

      {/* Challenge Info */}
      <div className="mb-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-lightGray mb-1">Challenge</p>
          <h4 className="text-base font-semibold text-darkGray">
            {challengeData.title}
          </h4>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-lightGray mb-2">Duration</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 hover:bg-gray-50"
                type="button"
              >
                <Calendar size={20} className="text-lightGray" />
                <span className="text-sm text-darkGray">
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(
                        dateRange.to,
                        "MMM d, yyyy"
                      )}`
                    : challengeData.duration}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <ShadCalendar
                mode="range"
                selected={dateRange}
                onSelect={(value) => {
                  if (value) {
                    setDateRange({
                      from: value.from,
                      to: value.to,
                    });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:space-y-0 space-y-4 md:gap-4 w-full">
        {/* Total Participants */}
        <div className="rounded-[10px] p-4 border border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm sm:text-base font-medium text-lightGray">
              Total Participants
            </span>
            <Image src={ICONS.users} alt="users" width={20} height={20} className="w-6 h-5"/>
          </div>
          <p className="text-2xl font-bold text-darkGray">
            {challengeData.totalParticipants}
          </p>
        </div>

        {/* Active Participants */}
        <div className="rounded-[10px] p-4 border border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm sm:text-base font-medium text-lightGray">
              Active Participants
            </span>
            <Image
              src={ICONS.checkcircle}
              alt="check"
              width={20}
              height={20}
              className="w-7 h-5"
            />
          </div>
          <p className="text-2xl font-bold text-darkGray">
            {challengeData.activeParticipants}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ActiveChallenge;
