import Image from "next/image";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-lightGray mb-1">{title}</p>
          <p className="text-xl font-semibold font-adelle text-darkGray">{value}</p>
        </div>
        <div className="-mt-7">
          <Image
            src={icon}
            alt={title}
            width={24}
            height={24}
            className="w-7 h-5"
          />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
