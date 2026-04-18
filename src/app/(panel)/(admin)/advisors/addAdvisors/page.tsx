import AdvisorAdd from "@/components/advisors/advisoradd";
import Advisorin from "@/components/advisors/advisorDetails";
import AuthGuard from '@/components/common/AuthGuard';
import React from "react";

export default function Page() {
  return (
    <AuthGuard>
      <AdvisorAdd />
    </AuthGuard>
  );
}
