"use client" ;

import { Input } from "../ui/input";
import React, { useEffect, useState } from "react";
import ICONS from "@/assets/icons";
import UserService from "@/services/userService";
import { useRouter } from "next/navigation";
import AdvisorService from "@/services/advisorService";

const advisorOptions = [
  "Lilly James",
  "Alex Buckmaster",
  "Sophie Turner"
];

interface EditPersonalInfoUserProps {
  userId: string;
}

export default function EditPersonalInfoUser({ userId }: EditPersonalInfoUserProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [advisor, setAdvisor] = useState<string>("");
  const [advisors, setAdvisors] = useState<{ _id: string; firstName: string; lastName: string }[]>([]);
  const [subscription, setSubscription] = useState("Premium");
  const [joined, setJoined] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await UserService.getUserById(userId);
        const u = userRes.data;
        setFirstName(u.firstName || "");
        setLastName(u.lastName || "");
        setEmail(u.email || "");
        setAdvisor(u.advisorId || "");
        setJoined(u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "");
      } catch (e) {
        console.error('Failed to load user', e);
      }
      try {
        const adv = await AdvisorService.getAllAdvisors();
        const mapped = adv.map((a: any) => ({ _id: a._id, firstName: a.firstName, lastName: a.lastName }));
        setAdvisors(mapped);
      } catch (e) {
        console.error('Failed to load advisors', e);
      }
    };
    fetchData();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const payload: any = {
        goal: "MAINTAIN_WEIGHT",
        firstName,
        lastName,
        // keep patch minimal; only include provided fields
        nutritionPlan: "MEAL_PLAN",
      };
      if (advisor) payload.advisorId = advisor;
      await UserService.updateUser(userId, payload);
      router.back();
    } catch (err) {
      console.error("Failed to update user", err);
      // You can add toast here if available
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 dow-md w-full">
    
      <div className="font-adelle text-[20px] font-semibold text-black mb-1">Edit Personal info</div>
      <div className="text-lightGray text-sm mb-4">Joined on {joined}</div>
      <hr className="mb-6" />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex gap-4 bg">
          <Input
            type="text"
            className="flex-1 rounded-[7px] dark:bg-gray border border-gray-200 px-4 py-2 text-base text-lightGray "
            placeholder="First name"
            value={firstName}
            readOnly
          />
          <Input
            type="text"
            className="flex-1 rounded-[7px] dark:bg-gray  border border-gray-200 px-4 py-2 text-base text-lightGray "
            placeholder="Last name"
            value={lastName}
            readOnly
          />
        </div>
        <Input
          type="email"
          className="rounded-[7px] dark:bg-gray border border-gray-200 px-4 py-2 text-base text-lightGray "
          placeholder="Email"
          value={email}
          readOnly
        />
        <div>
          <label className="block text-sm text-darkGray mb-1">Advisor</label>
          <div className="relative">
            <button
              type="button"
              className="w-full rounded-[7px] dark:bg-gray border border-gray-200 px-4 py-2 text-base text-lightGray flex justify-between items-center "
              onClick={() => setShowDropdown(v => !v)}
            >
              {advisors.find(a => a._id === advisor) ? `${advisors.find(a => a._id === advisor)?.firstName} ${advisors.find(a => a._id === advisor)?.lastName}` : (advisor ? advisor : 'Select advisor')}
              <img
                src={ICONS.dropsimple}
                alt="dropdown arrow"
                className={`ml-2 transition-transform w-4 h-4 ${showDropdown ? 'rotate-180' : ''}`}
                style={{ transform: showDropdown ? 'rotate(180deg)' : 'none' }}
              />
            </button>
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[7px] shadow z-10">
                {advisors.map(opt => (
                  <div
                    key={opt._id}
                    className={`px-4 py-2 cursor-pointer ${opt._id === advisor ? 'font-bold' : ''}`}
                    onClick={() => { setAdvisor(opt._id); setShowDropdown(false); }}
                  >
                    {opt.firstName} {opt.lastName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm text-darkGray mb-1">Subscription Plan</label>
          <Input
            type="text"
            className="w-full rounded-[7px] dark:bg-gray border border-gray-200 px-4 py-2 text-base text-lightGray"
            value={subscription}
            readOnly
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#F6D4B9] rounded-[7px] py-3  text-base font-semibold text-black  transition mt-2"
        >
          Save changes
        </button>
      </form>
    </div>
  
  );
}
