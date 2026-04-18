"use client";
import React from "react";
import { Users, UserCheck, Star } from "lucide-react";
import StatCard from "./StatCard";
import ICONS from "@/assets/icons";
import RecentUsers from "./RecentUsers";
import ActiveChallenge from "./ActiveChallenge";
import TopAdvisors from "./topAdvisors";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats();

  const statsData = [
    {
      title: "Total Users",
      value: loading ? "..." : stats?.totalUsers?.toString() || "0",
      icon: ICONS.users,
    },
    {
      title: "Total Advisors",
      value: loading ? "..." : stats?.totalAdvisors?.toString() || "0",
      icon: ICONS.advisors,
    },
    {
      title: "Active Subscriptions",
      value: loading ? "..." : stats?.activeSubscriptions?.toString() || "0",
      icon: ICONS.subscriptions,
    },
  ];

  return (
    <div className="md:mx-0 mx-5 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <ActiveChallenge />
        <TopAdvisors />
      </div>
      <RecentUsers />
    </div>
  );
}
