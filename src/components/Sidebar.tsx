"use client";
import React, { useState } from 'react';
import { 
  Bell, 
  LayoutDashboard,
  Users,
  UserCheck,
  Trophy,
  Calendar,
  BarChart3,
  Radio,
  Settings,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import App from 'next/app';
// import { useState } from 'react';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'advisors', icon: UserCheck, label: 'Advisors' },
    { id: 'challenges', icon: Trophy, label: 'Challenges' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'broadcasts', icon: Radio, label: 'Broadcasts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
<nav className="w-16 bg-white border-r border-gray-300 flex flex-col items-center py-6 space-y-10 mt-6 h-[calc(100vh-5rem)] rounded-xl mx-2 shadow-sm">

      {menuItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => setActiveItem(item.id)}
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center transition-colors
            ${activeItem === item.id 
              ? 'bg-orange-200 text-orange-700' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }
          `}
          title={item.label}
        >
          <item.icon className="h-5 w-5" />
        </button>
      ))}
      
      {/* Bottom refresh button */}
      <div className="flex-1 flex items-end">
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          title="Refresh"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;