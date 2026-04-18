import React from "react";
import { User } from "lucide-react";
import { useRecentUsers } from "@/hooks/useRecentUsers";
import { IUser } from "@/lib/api/types";

interface UserActivity {
  id: string;
  type: string;
  userName: string;
  action: string;
  timestamp: string;
}

interface RecentUsersProps {
  activities?: UserActivity[];
  maxItems?: number;
}

function RecentUsers({
  activities = [],
  maxItems = 3,
}: RecentUsersProps) {
  const { users, loading, error } = useRecentUsers();

  // Transform API data to component format
  const transformedActivities: UserActivity[] = users.map((user: IUser) => ({
    id: user._id,
      type: "New User",
    userName: `${user.firstName} ${user.lastName}`.trim() || 'Unknown User',
      action: "joined the platform",
    timestamp: new Date(user.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
  }));

  // Use API data if available, otherwise use props, otherwise use default
  const displayActivities = transformedActivities.length > 0 ? transformedActivities : 
                           activities.length > 0 ? activities : [];
  const limitedActivities = displayActivities.slice(0, maxItems);

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-darkGray">Recent Users</h3>
      </div>

      <div className="space-y-4">
        {limitedActivities.map((activity, index) => (
          <div
            key={activity.id || index}
            className="flex items-start space-x-3 py-3 px-3 border-2 rounded-[10px] border-gray-200"
          >
            <div className="flex-shrink-0 mt-4">
              <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-md font-bold text-gray-900 mb-1">
                    {activity.type}
                  </p>
                  <p className="text-sm text-lightGray">
                    {activity.userName} {activity.action}
                  </p>
                </div>
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                  {activity.timestamp}
                </span>
              </div>
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
          <p className="text-sm text-gray-500">Loading recent users...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <User className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-sm text-red-500">Failed to load recent users</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayActivities.length === 0 && (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No recent user activity</p>
        </div>
      )}
    </div>
  );
}

export default RecentUsers;
