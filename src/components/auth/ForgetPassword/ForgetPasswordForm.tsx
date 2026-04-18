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
import { Input } from "@/components/ui/input";
import { errorToast, successToast } from "@/lib/toasts";
import { ForgetFormSchema } from "@/utils/validations";
import { useState } from "react";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import '../../../amplifyconfig'; // Adjust path if needed

import { resetPassword } from 'aws-amplify/auth';

export default function ForgetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof ForgetFormSchema>>({
    resolver: zodResolver(ForgetFormSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(data: z.infer<typeof ForgetFormSchema>) {
    try {
      setIsLoading(true)
      await resetPassword({ username: data.email });
      successToast(`Otp sent successfully`, "Success");
      router.replace(`/verify?email=${encodeURIComponent(data.email)}`)
    }
    catch (error: any) {
      errorToast(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="auth_input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className="w-full rounded-[5px] font-semibold py-6 bg-lightBrown hover:bg-lightBrown !mt-8" type="submit">
          {isLoading ? <Loader width="w-4" height="h-4" /> : 'Get Code'}
        </Button>
      </form>
    </Form>
  );
}