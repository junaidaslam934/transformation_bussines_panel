"use client";
import { Lock, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import ICONS from "@/assets/icons";
import { PasswordInput } from "../ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UpdatePasswordFormSchema } from "@/utils/validations";
import { errorToast, successToast } from "@/lib/toasts";
import Loader from "@/components/Loader";
import { updatePassword } from 'aws-amplify/auth';
import '@/amplifyconfig';

export default function Settings() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UpdatePasswordFormSchema>>({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const handlePasswordChange = () => {
    setShowPasswordChange(true);
  };

  async function onSubmit(data: z.infer<typeof UpdatePasswordFormSchema>) {
    try {
      setIsLoading(true);
      
      // Use AWS Amplify updatePassword function
      await updatePassword({
        oldPassword: data.old_password,
        newPassword: data.new_password,
      });
      
      successToast("Password changed successfully", "Success");
      setShowPasswordChange(false);
      form.reset();
    } catch (error: any) {
      console.log("error ==>> ", error);
      errorToast(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (showPasswordChange) {
    return (
      <div className="w-full max-w-2xl md:mx-0 mx-auto px-3 sm:px-6 md:px-0 pb-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center mb-4">
              <Button
                type="button"
                onClick={() => {
                  setShowPasswordChange(false);
                  form.reset();
                }}
                className="mr-3 p-2 hover:bg-gray-100 rounded-full"
                variant="ghost"
              >
                <ChevronRight className="w-5 h-5 text-lightGray rotate-180" />
              </Button>
              <h1 className="font-adelle text-[20px] font-semibold">
                Want to change password?
              </h1>
            </div>
           
            <p className="text-lightGray mt-1 text-s">
              Enter your old password to create a new password
            </p>
            <div className="w-full border-b border-gray-200 "></div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="old_password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="block text-sm sm:text-base font-semibold text-darkGray pb-3">
                        Enter old password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          className="rounded-[5px] !text-sm py-6 px-4 text-lightGray placeholder-gray-500 leading-relaxed tracking-widest font-light focus:outline-none focus:ring-0 focus:shadow-none bg-inherit border-[#DBDBDB];"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="block text-sm sm:text-base font-semibold text-darkGray pb-3 pt-3">
                        Enter new password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          className="rounded-[5px] !text-sm py-6 px-4 text-darkGray placeholder-gray-500 leading-relaxed tracking-widest font-light focus:outline-none focus:ring-0 focus:shadow-none bg-inherit border-[#DBDBDB];"
                          placeholder="Enter new password"
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
                    <FormItem className="space-y-1 pt-1">
                      <FormControl>
                        <PasswordInput
                          className="rounded-[5px] !text-sm py-6 px-4 text-darkGray placeholder-gray-500 leading-relaxed tracking-widest font-light focus:outline-none focus:ring-0  focus:shadow-none bg-inherit border-[#DBDBDB];"
                          placeholder="Confirm new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-3 ">
                  <Button 
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 sm:py-3 bg-lightBrown text-darkGray font-semibold rounded-[5px] hover:bg-lightBrown transition-colors text-sm sm:text-base" 
                    type="submit"
                  >
                    {isLoading ? <Loader width="w-4" height="h-4" /> : "Change Password"}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      form.reset();
                    }}
                    className="flex-1 px-4 py-2 sm:py-3 bg-gray-200 text-darkGray font-semibold rounded-[5px] hover:bg-gray-300 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:px-0 px-4 pb-6">
      <div className="bg-white rounded-lg ">
        <div className="p-4 md:p-6">
          <h1 className="text-xl font-semibold text-darkGray">Settings</h1>
        </div>

        <div className="px-4 md:px-6 pb-6 ">
          <Button
            onClick={handlePasswordChange}
            className="w-full border border-grayBroder rounded-[5px] flex items-center justify-between py-4 sm:py-6 lg:py-8 px-4 "
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image src={ICONS.lock} alt="lock" width={15} height={15} className="w-5 h-4"/>
              <span className="text-lightGray  font-medium text-base sm:text-lg p">
                Change password
              </span>
            </div>
            <ChevronRight className="w-5 h-5  text-lightGray flex-shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
