"use client";
import React from "react";
import { Bell, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ICONS from "@/assets/icons";

export default function NotificationLists() {
  const notifications = [
    {
      id: "1",
      title: "High activity alert",
      description:
        "User @fit_guru logged 7 meals today — highest among tracked users.",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      title: "New recipe added",
      description: "User @chef_jane uploaded a new recipe for 'Quinoa Salad'.",
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      title: "Daily goal achieved",
      description:
        "User @health_enthusiast met their calorie goal for the day.",
      timestamp: "6 hours ago",
    },
    {
      id: "4",
      title: "Profile updated",
      description:
        "User @active_learner updated their weight and activity level.",
      timestamp: "8 hours ago",
    },
    {
      id: "5",
      title: "Low water intake warning",
      description: "User @hydration_hero logged only 2 glasses of water today.",
      timestamp: "10 hours ago",
    },
    {
      id: "6",
      title: "User milestone reached",
      description: "User @motivation_master completed 100 workouts this month.",
      timestamp: "12 hours ago",
    },
    {
      id: "7",
      title: "Weekly summary available",
      description:
        "User @fitness_fanatic received their weekly progress report.",
      timestamp: "1 day ago",
    },
    {
      id: "8",
      title: "Portion entry missing grams",
      description:
        "'Protein Shake - Vanilla' has a portion without a gram value.",
      timestamp: "1 day ago",
    },
    {
      id: "9",
      title: "Portion entry missing grams",
      description:
        "'Protein Shake - Vanilla' has a portion without a gram value.",
      timestamp: "1 day ago",
    },
    {
      id: "10",
      title: "Portion entry missing grams",
      description:
        "'Protein Shake - Vanilla' has a portion without a gram value.",
      timestamp: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-darkGray">Notificaitons</h1>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm font-semibold  text-darkGray"
          >
            <span className="flex gap-1 underline underline-offset-2">
              <Image
                src={ICONS.bell}
                alt="rightcheck"
                width={20}
                height={20}
                className="underline"
              />
              Mark all as read
            </span>
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-8">
        <div className="space-y-0">
          {notifications.map((notification, index) => (
            <div key={notification.id}>
              <div className="flex items-start gap-4 py-4 cursor-pointer">
                {/* Bell Icon */}
                <div className="flex-shrink-0 mt-2">
                  <Image
                    src={ICONS.bell}
                    alt="bell"
                    width={40}
                    height={40}
                    className="w-8 h-8"
                  />
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-darkGray">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-lightGray mt-1">
                    {notification.description}
                  </p>
                </div>

                {/* Chevron Icon */}
                <div className="flex-shrink-0 mt-5">
                  <ChevronRight className="w-4 h-4 text-lightGray" />
                </div>
              </div>

              {/* Divider */}
              {index < notifications.length - 1 && (
                <div className="border-b border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
