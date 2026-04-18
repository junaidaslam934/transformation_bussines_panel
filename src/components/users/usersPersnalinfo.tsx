import React from "react";
import Link from "next/link";
import ROUTES from "@/components/constants/routes";

const user = {
  id: "687a0f65d7968b14d8c50a6d",
  name: "Daniel Hamilton",
  email: "Daniel.Hamilton@gmail.com",
  advisor: "Lilly James",
  subscription: "Premium",
  joined: "12 January 2025",
};

const UserPersonalInfo = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 dow-md w-full">
      <div className="font-adelle text-[20px] font-semibold text-black mb-1">Personal info</div>
      <div className="text-lightGray text-sm mb-4">Joined on {user.joined}</div>
      <hr className="mb-6" />
      <div className="flex flex-col items-center mb-8">
        <div className="w-28 h-28 rounded-[16px] bg-[#F6D4B9] flex items-center justify-center mb-6">
          <span className="text-6xl font-adelle text-gray-800">{user.name[0]}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mb-8 w-full max-w-xs mx-auto">
        <div className="flex flex-row w-full text-base">
          <span className="text-gray-600 font-medium min-w-[140px]">Name: </span>
          <span className="text-black font-semibold">{user.name}</span>
        </div>
        <div className="flex flex-row w-full text-base">
          <span className="text-gray-600 font-medium min-w-[140px]">Email: </span>
          <span className="text-black font-semibold">{user.email}</span>
        </div>
        <div className="flex flex-row w-full text-base">
          <span className="text-gray-600 font-medium min-w-[140px]">Assigned Advisor: </span>
          <span className="text-black font-semibold">{user.advisor}</span>
        </div>
        <div className="flex flex-row w-full text-base">
          <span className="text-gray-600 font-medium min-w-[140px]">Subscription Type: </span>
          <span className="text-black font-semibold">{user.subscription}</span>
        </div>
      </div>
    
      <Link href={`${ROUTES.userManagement.userEdit}/${user.id}`} className="w-full bg-[#F6D4B9] rounded-[7px] py-3 font-adelle text-base font-semibold text-black hover:bg-[#f3c9a7] transition text-center block">Edit profile</Link>
    </div>
  );
};

export default UserPersonalInfo;
