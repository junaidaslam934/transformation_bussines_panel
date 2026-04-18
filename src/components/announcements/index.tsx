import React from "react";
import AnnouncementsList from "./AnnouncementsList";
import AddAnnouncement from "./AddAnnouncement";

export default function Announcements() {
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 p-3 lg:p-0">
      <div className="w-full lg:w-[60%] lg:order-1 h-full scrollable-container scrollbar-hide">
          <AnnouncementsList />
      </div>
      <div className="w-full lg:w-[40%] lg:order-2 h-auto lg:h-full">
        <AddAnnouncement />
      </div>
    </div>
  );
}
