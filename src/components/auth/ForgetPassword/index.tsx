import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import ForgetPasswordForm from "./ForgetPasswordForm";

export default function ForgetPassword() {
  return (
    <div className="h-full flex flex-col items-center justify-center py-5">
      <div className="w-full">
        <h1 className=" font-adelle md:text-[40px] text-[20px] font-semibold text-darkGray text-center">
          Forgot Password?
        </h1>
        <p className="text-sm text-[#637381] mt-5 text-center">
          Enter you email to get verification code
        </p>
      </div>
      <div className="w-full mt-10 flex flex-col items-stretch gap-4">
        <ForgetPasswordForm />
        <p className="text-center text-darkGray text-sm font-normal">
          <Button
            className="p-0 underline  text-darkGray"
            asChild
          >
            {/* "font-adelle text-[17px] font-medium text-gray-800 pb-6" */}
            <Link
              className="text-base font-semibold"
              href={"/login"}
            >
              Back to Login
            </Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
