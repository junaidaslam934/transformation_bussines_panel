import Settings from "@/components/settings";
import AuthGuard from '@/components/common/AuthGuard';
import React from "react";

export default function Page() {
  return (
    <AuthGuard>
      <Settings />
    </AuthGuard>
  );
}
