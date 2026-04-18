"use client";

import React, { useState } from "react";
import PreviousChallenges from "./previouschallenge";
import ActiveChallenge from "./activeChallenge";
import { Button } from "../ui/button";

const challangeindex  = () => {

  const [activeTab, setActiveTab] = useState("previous");

  return (
 <div>
  {/* Header Tabs */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div className="flex space-x-4">
      <Button
        onClick={() => setActiveTab("previous")}
        className={`py-2 px-4 rounded-[8px] font-light text-sm transition-colors duration-200 ${
          activeTab === "previous"
            ? 'bg-lightBrown text-black'
            : "bg-white text-gray-600 hover:text-black border border-gray-200"
        }`}
      >
        Previous Challenges
      </Button>
      <Button
        onClick={() => setActiveTab("active")}
        className={`py-2 px-4 rounded-[8px] font-light text-sm transition-colors duration-200 ${
          activeTab === "active"
            ? 'bg-lightBrown text-black'
            : "bg-white text-gray-600 hover:text-black border border-gray-200"
        }`}
      >
        Active Challenge
      </Button>
    </div>
  </div>
  
  {/* Conditional Component Rendering */}
  {activeTab === "previous" ? <PreviousChallenges /> : <ActiveChallenge />}
</div>
  );
};

export default challangeindex;
