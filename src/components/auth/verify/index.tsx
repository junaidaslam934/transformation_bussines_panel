"use client";
import React from "react";
import VerifyEmail from "./VerifyEmail";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function VerifyCode() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  return (
    <div className=" flex flex-col items-center justify-center px-2 py-4">
      <div className="w-full space-y-6">
        {/* Email Verification Section */}
        <div className="text-center space-y-4">
          <h1 className=" font-adelle text-3xl font-bold text-darkGray">
          Reset Password 
          </h1>
          <p className="text-sm text-lightGray">
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-darkGray">{email}</span>
          </p>
        </div>

        {/* OTP and Password Form */}
        <VerifyEmail />

        {/* Edit Email Section */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-1 text-sm text-lightGray">
            <span>Entered the wrong email?</span>
            <Button variant="link" className="text-darkGray underline font-medium p-0 h-auto min-w-0" onClick={() => router.push('/forget-password')}>
              Edit Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
