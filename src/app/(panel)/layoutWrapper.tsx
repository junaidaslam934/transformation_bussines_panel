"use client";

import React from "react";
import Header from "@/components/common/header";
import SidebarWrapper from "@/components/common/sidebar";

function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex gap-5 w-full lg:w-[97%] mx-auto h-[calc(100vh-95px)]">
        <div className="hidden lg:block w-[250px]">
          <SidebarWrapper />
        </div>
        <div className="min-w-0 flex-1 flex flex-col">
          <div className="h-auto flex-grow flex flex-col overflow-hidden ">
            <div className="flex-1 overflow-auto scrollbar-hide">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LayoutWrapper;
