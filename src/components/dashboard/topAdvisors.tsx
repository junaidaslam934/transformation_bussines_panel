import React from "react";
import { MoreHorizontal, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTopAdvisors } from "@/hooks/useTopAdvisors";
import { ITopAdvisor } from "@/lib/api/types";

interface Advisor {
  id: string;
  rank: number;
  name: string;
  assignedUsers: number;
  avatar: string;
}

interface TopAdvisorsProps {
  advisors?: Advisor[];
  maxItems?: number;
}

const TopAdvisors: React.FC<TopAdvisorsProps> = ({
  advisors = [],
  maxItems = 3,
}) => {
  const { advisors: apiAdvisors, loading, error } = useTopAdvisors();

  // Transform API data to component format
  const transformedAdvisors: Advisor[] = apiAdvisors.map((advisor: ITopAdvisor, index: number) => ({
    id: advisor._id,
    rank: index + 1,
    name: `${advisor.firstName} ${advisor.lastName}`.trim() || 'Unknown Advisor',
    assignedUsers: advisor.userCount,
    avatar: advisor.profileImage || "/assets/images/advisors.png",
  }));

  // Use API data if available, otherwise use props, otherwise use default
  const displayAdvisors = transformedAdvisors.length > 0 ? transformedAdvisors : 
                         advisors.length > 0 ? advisors : [];
  const limitedAdvisors = displayAdvisors.slice(0, maxItems);

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-darkGray">Top Advisors</h3>
        <Button className="text-sm text-darkGray transition-colors underline">
          <Link href="/advisors">See more</Link>
        </Button>
      </div>

      {/* Advisors List */}
      <div className="space-y-4">
        {limitedAdvisors.map((advisor) => (
          <div key={advisor.id} className="flex items-center space-x-4 py-2">
            {/* Rank */}
            <div className="flex-shrink-0 w-6">
              <span className="text-lg font-semibold text-lightGray">
                #{advisor.rank}
              </span>
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0">
              <Image
                src={advisor.avatar}
                alt={advisor.name}
                width={60}
                height={60}
              />
            </div>

            {/* Advisor Info */}
            <div className="min-w-0  gap-1 flex flex-col">
              <p className="text-md font-bold text-darkGray truncate">
                {advisor.name}
              </p>
              <p className="text-sm text-lightGray">
                {advisor.assignedUsers} assigned users
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
          </div>
          <p className="text-sm text-lightGray">Loading advisors...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <Users className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-sm text-red-500">Failed to load advisors</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayAdvisors.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <Users className="w-6 h-6 text-lightGray" />
          </div>
          <p className="text-sm text-lightGray">No advisors found</p>
        </div>
      )}
    </div>
  );
};

export default TopAdvisors;
