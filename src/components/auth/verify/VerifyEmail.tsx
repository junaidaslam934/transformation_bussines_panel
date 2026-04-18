"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { PasswordInput } from "@/components/ui/password-input";
import { errorToast, successToast } from "@/lib/toasts";
import { ResetFormSchema } from "@/utils/validations";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import '../../../amplifyconfig'; // Adjust path if needed

import { confirmResetPassword, resetPassword, signOut } from 'aws-amplify/auth';

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false)
  const [resendOtpLoading, setResendOtpLoading] = useState(false)
  const [otpSentTimer, setOtpSentTimer] = useState(32);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const isReset = searchParams.get("isReset");

  const form = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
      code: ""
    },
  });

  useEffect(() => {
    if (!email || !email.toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      router.push('/forget-password');
    }
  }, [])

  useEffect(() => {
    let interval: any
    if (isTimerRunning) {
      interval = setInterval(() => setOtpSentTimer((prevTimer) => prevTimer - 1), 1000);
      if (otpSentTimer === 0) {
        clearInterval(interval)
        setIsTimerRunning(false)
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, otpSentTimer]);

  async function onSubmit(data: z.infer<typeof ResetFormSchema>) {
    if (!isTimerRunning) {
      errorToast("The verification code has expired. Please request a new code.");
      return;
    }
    try {
      setIsLoading(true)
      await confirmResetPassword({
        username: email!,
        confirmationCode: data.code,
        newPassword: data.new_password,
      });
      await signOut(); // Ensure user is signed out after password reset
      successToast("Reset password successfully", "Success");
      router.replace(`/login`)
    }
    catch (error: any) {
      console.log("error ==>> ", error);
      errorToast(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  async function resendOtp() {
    try {
      setResendOtpLoading(true)
      await resetPassword({ username: email! });
      successToast(`Otp re-sent successfully to ${email}`, "Success");
      setOtpSentTimer(60)
      setIsTimerRunning(true)
    }
    catch (error: any) {
      errorToast(error.message)
    }
    finally {
      setResendOtpLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {/* OTP Input Section */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup typeof="number" className="justify-between w-full gap-2">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-10 h-10 md:w-12 md:h-12 lg:w-[52px] lg:h-[52px] !rounded-[5px] text-center text-xl md:text-2xl border border-gray-300 focus:outline-none !focus:ring-0"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Timer and Resend */}
          <div className="space-y-3">
            {isTimerRunning && (
              <p className="text-center text-xl text-darkGray">
                {formatTime(otpSentTimer)}
              </p>
            )}
            <div className="text-center">
              <span className="text-base text-darkGray">Didn't get code? </span>
              <Button
                type="button"
                className="p-0 h-auto text-darkGray font-semibold underline"
                disabled={isTimerRunning || resendOtpLoading}
                onClick={resendOtp}
              >
                {resendOtpLoading ? <Loader width="w-4" height="h-4" /> : "Resend"}
              </Button>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-6">
            <p className="text-base text-lightGray text-center">
              Enter a strong password to secure your account.
            </p>
            
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your password"
                      className="auth_input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm your password"
                      className="auth_input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button disabled={isLoading || !isTimerRunning} className="w-full rounded-[5px] font-semibold py-6 bg-lightBrown hover:bg-lightBrown !mt-8" type="submit">
            {isLoading ? <Loader width="w-4" height="h-4" /> : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </>
  );
}