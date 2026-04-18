"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ICONS from "@/assets/icons";
import { SIDEBAR } from "../constants/staticData";
import { LogOut } from "lucide-react";
import { logout } from '@/utils/auth';
import '../../amplifyconfig'; // Adjust pPM ath if needed


export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="w-[250px] bg-white flex flex-col p-4 h-full scrollbar-hide">
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 text-lightGray">
          {SIDEBAR.map((menu, idx) => {
            const isActive =
              pathname === menu.path ||
              pathname.startsWith(`${menu.path}/`);
            return (
              <li key={idx}>
                <Link
                  href={menu.path}
                  className={`flex items-center gap-3 rounded-[10px] px-3 py-2 transition-colors ${
                    isActive
                      ? "text-darkGray bg-lightBrown font-semibold"
                      : "hover:text-darkGray hover:bg-lightBrown"
                  }`}
                >
                  {menu.icons && (
                    <Image
                      src={isActive ? menu.icons.filled : menu.icons.default}
                      alt={`${menu.label} Icon`}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  )}
                  <span className="text-[13px]">{menu.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with logout */}
      <div className="mt-4 pt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-[10px] px-3 py-2 text-lightGray"
        >
          <Image
            src={ICONS.logout}
            alt="Logout Icon"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="font-medium text-[13px]">Logout</span>
        </button>
      </div>
    </div>
  );
}
