"use client";
import { adelle } from "@/app/fonts";
import SignInForm from "@/components/auth/Login/SignInForm";
import React from "react";

function Login() {
  return (
    <div className="h-full flex flex-col w-full py-10">
      <div className="w-full">
        <h3
          className={`text-[30px] text-center text-darkGray ${adelle.variable} font-adelle font-semibold`}
        >
          Welcome! Log in to access your account.
        </h3>
      </div>
      <div className="w-full mt-8 flex flex-col items-stretch gap-4">
        <SignInForm />
      </div>
    </div>
  );
}

export default Login;
