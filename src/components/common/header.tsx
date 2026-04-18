"use client";

import React from "react";
import Image from "next/image";
import ICONS from "@/assets/icons";
import Link from "next/link";
import { Button } from "../ui/button";
import { useUserStore } from "@/store/userStore";

interface HeaderProps {
  className?: string;
}

function Header({ className = "" }: HeaderProps) {
  const { user } = useUserStore();
  
  return (
    <header
      className={`bg-white border-b border-gray-200 mb-4 px-5 py-3 ${className}`}
    >
      <div className="flex items-center justify-between w-full">
        <Image
          src="/assets/logo/black-logo.png"
          alt="Company Logo"
          width={200}
          height={200}
          className="w-44 h-8"
        />

        {/* Right side - Notifications and User Profile */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Notification Bell */}
          <Button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Link href="/notifications">
              <Image
                src={ICONS.notification}
                alt="Notifications"
                width={40}
                height={20}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              {/* Notification badge (optional) */}
            </Link>
          </Button>

          {/* User Profile Section */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* User Avatar */}
            <div className="relative">
              <Image
                src="/assets/images/user-avatar.png" // You'll need to add this image
                alt="David Elson"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200"
              />
            </div>

            {/* User Info - Hidden on mobile */}
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-gray-900">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
