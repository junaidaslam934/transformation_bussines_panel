"use client";

import { Suspense } from "react";
import VerifyCode from "@/components/auth/verify";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyCode />
    </Suspense>
  );
}
