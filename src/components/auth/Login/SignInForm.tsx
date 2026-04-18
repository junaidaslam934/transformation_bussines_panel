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
  // Adjust path if needed

  import { Input } from "@/components/ui/input";
  import { PasswordInput } from "@/components/ui/password-input";
  import { errorToast, successToast } from "@/lib/toasts";
  import { SignInFormSchema } from "@/utils/validations";
  import Link from "next/link";
  import { useEffect, useState } from "react";
  import Loader from "@/components/Loader";
  import { useRouter } from "next/navigation";
  import { adelle, ceraProBold } from "@/app/fonts";
import { signIn, getCurrentUser, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { useUserStore } from "@/store/userStore";
import UserService from "@/services/userService";
import '../../../amplifyconfig'; // Adjust


  export type ISignInFormSchema = z.infer<typeof SignInFormSchema>;

  export default function SignInForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { setUser, setAuthToken } = useUserStore();

    const form = useForm<ISignInFormSchema>({
      resolver: zodResolver(SignInFormSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    async function onSubmit(data: ISignInFormSchema) {
      console.log("data ==>> ", data);
  
      try {
        setIsLoading(true);

        // 1. Sign in with Cognito (Amplify v6+)
        const { isSignedIn, nextStep } = await signIn({ username: data.email, password: data.password });

        if (!isSignedIn) {
          errorToast('Additional authentication required', nextStep?.signInStep || 'Unknown step');
          return;
        }
        // 2. Get the current authenticated user (Amplify v6+)
        const cognitoUser = await getCurrentUser();

        const session = await fetchAuthSession();
        const userSub = session.userSub;
        const userAttributes = await fetchUserAttributes();

        // Set accessToken as a cookie for API calls
        const accessToken = session.tokens?.accessToken?.toString();
        if (accessToken) {
          document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=lax`;
        }

        // Set auth token for API calls
        if (accessToken) {
          setAuthToken(accessToken);
        }

        // Call API to get full user data
        try {
          if (userSub) {
            const userResponse = await UserService.getUserByCognitoId(userSub);
            
            if (userResponse && userResponse.success && userResponse.data) {
              // Save the complete user data to Zustand store
              // Cast the user data to match UserInfo interface
              const userData = {
                ...userResponse.data,
                role: userResponse.data.role as "ADMIN" | "USER" | "ADVISOR",
                accountStatus: userResponse.data.accountStatus as "ACTIVE" | "INACTIVE" | "PENDING",
                currentWeightUnit: userResponse.data.currentWeightUnit as "KG" | "LB" | null,
                weightUnit: userResponse.data.weightUnit as "KG" | "LB" | null,
                sizeUnit: userResponse.data.sizeUnit as "INCH" | "CM",
                gender: userResponse.data.gender as "MALE" | "FEMALE" | "OTHER",
                heightUnit: userResponse.data.heightUnit as "INCH" | "CM" | null,
                nutritionPlan: userResponse.data.nutritionPlan as "MACRO_TRACKING" | "CALORIE_COUNTING" | "INTUITIVE_EATING",
                trainingLevel: userResponse.data.trainingLevel as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
                activity: userResponse.data.activity as "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE"
              };
              setUser(userData);
              successToast("You're logged in!", `Welcome, ${userResponse.data.firstName} ${userResponse.data.lastName}`);
            } else {
              successToast("You're logged in!", `Welcome, ${cognitoUser.username}`);
            }
          }
        } catch (apiError: any) {
          successToast("You're logged in!", `Welcome, ${cognitoUser.username}`);
        }

        // 6. Redirect to dashboard
        window.location.replace("/dashboard");
      } catch (error: any) {
        console.log("error ==>> ", error);
        errorToast(error.message || "Login failed");
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      // Prevent going back to the previous page (like dashboa  rd)
      window.history.pushState(null, "", window.location.href); // Adds a new state to history
      window.onpopstate = () => {
        window.history.go(1); // Prevent back navigation
      };
    }, []);

    return (
      <>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="!mt-4 space-y-1">
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
            <span className="text-right">
              <Link href="/forget-password">
                <p
                  className={`text-[13px] font-semibold mt-2 text-darkGray`}
                >
                  Forgot Password?
                </p>
              </Link>
            </span>
            <Button
              disabled={isLoading}
              className={`w-full text-[13px] font-semibold text-darkGray hover:bg-lightBrown rounded-[10px] py-6 bg-lightBrown !mt-8`}
              type="submit"
            >
              {isLoading ? <Loader width="w-4" height="h-4" /> : "Login"}
            </Button>
          </form>
        </Form>
      </>
    );
  }
