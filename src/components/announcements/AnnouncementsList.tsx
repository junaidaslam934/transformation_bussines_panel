"use client";

import React, { useEffect, useState } from "react";
import AnnouncementCard from "./AnnouncementCard";
import { AnnouncementService } from "../../services/announcementService";

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user-storage");
    let userId = "";
    try {
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userId = userObj?.state?.user?._id;
      }
    } catch (e) {
      // ignore
    }
    if (!userId) {
      console.log("No user ID found");
      setLoading(false);
      return;
    }
    AnnouncementService.getAnnouncements(userId)
      .then((data) => {
        setAnnouncements(data);
      })
      .catch(() => {
        setAnnouncements([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-3 sm:space-y-4 ">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement._id} {...announcement} />
      ))}
    </div>
  );
}