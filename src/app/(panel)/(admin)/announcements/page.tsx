import Announcements from "@/components/announcements";
import AuthGuard from '@/components/common/AuthGuard';
import React from "react";

export default function Page() {
  return (
    <AuthGuard>
      <Announcements />
    </AuthGuard>
  );
}
