// Validations

import { z } from "zod";

// SignUpForm Validation
const SignUpFormSchema = z.object({
  // firstName: z
  //   .string()
  //   .trim()
  //   .min(3, { message: 'First Name must be at least 3 characters long.' })
  //   .max(35, { message: 'First Name must be no more than 35 characters long.' })
  //   .regex(/^[A-Za-z]+$/, { message: "First Name can only contain alphabets." }),
  // lastName: z
  //   .string()
  //   .trim()
  //   .min(3, { message: 'Last Name must be at least 3 characters long.' })
  //   .max(35, { message: 'Last Name must be no more than 35 characters long.' })
  //   .regex(/^[A-Za-z]+$/, { message: "Last Name can only contain alphabets." }),
  userName: z
    .string()
    .trim()
    .min(3, { message: 'User Name must be at least 3 characters long.' })
    .max(50, { message: 'User Name must be no more than 50 characters long.' })
    .regex(/^[A-Za-z ]+$/, { message: "User Name can only contain alphabets and spaces." }),
  company: z
    .string()
    .trim()
    .min(2, { message: 'Company Name must be at least 2 characters long.' })
    .max(35, { message: 'Company Name must be no more than 35 characters long.' })
    .regex(/^[A-Za-z0-9'\&\.\,\(\)\-\s]+$/, {
      message: "Company Name can only contain letters, numbers, spaces, and these special characters: ' & . , ( ) -"
    }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email("Enter a valid email address"),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(50, { message: "Password must be no more than 50 characters long." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*#?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, #, ?, &)." }),

  confirm_password: z
    .string()
    .min(1, { message: "Confirm password is required" })
}).superRefine((val, ctx) => {
  if (val.password !== val.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords must match.',
      path: ['confirm_password'],
    })
  }
})


// SignInForm Validation
const SignInFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, 'Password is required')
});

// ForgetFormSchema Validation
const ForgetFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email("Enter a valid email address")
});

// UpdateProfileFormForAdminSchema Validation
const UpdateProfileFormForAdminSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full Name is required'),
});

// UpdateProfileFormForManagerSchema Validation
const UpdateProfileFormForManagerSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, { message: 'User Name must be at least 3 characters long.' })
    .max(50, { message: 'User Name must be no more than 50 characters long.' })
    .regex(/^[A-Za-z ]+$/, { message: "User Name can only contain alphabets and spaces." }),
  // firstName: z
  //   .string()
  //   .trim()
  //   .min(3, { message: 'First Name must be at least 3 characters long.' })
  //   .max(35, { message: 'First Name must be no more than 35 characters long.' })
  //   .regex(/^[A-Za-z]+$/, { message: "First Name can only contain alphabets." }),
  // lastName: z
  //   .string()
  //   .trim()
  //   .min(3, { message: 'Last Name must be at least 3 characters long.' })
  //   .max(35, { message: 'Last Name must be no more than 35 characters long.' })
  //   .regex(/^[A-Za-z]+$/, { message: "Last Name can only contain alphabets." }),
  profileImage: z.
    string()
});

// ResetFormSchema Validation
const ResetFormSchema = z.object({
  code: z
    .string({ required_error: "enterOtp" })
    .trim()
    .min(6, { message: "6 digits otp is required.", }),
  new_password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(50, { message: "Password must be no more than 50 characters long." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*#?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, #, ?, &)." }),

  confirm_password: z
    .string()
    .min(1, { message: "Confirm password is required" })
}).superRefine((val, ctx) => {
  if (val.new_password !== val.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords must match.',
      path: ['confirm_password'],
    })
  }
})

// UpdatePasswordFormSchema Validation
const UpdatePasswordFormSchema = z.object({
  old_password: z
    .string()
    .min(1, { message: "Old password is required" }),
  new_password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(50, { message: "Password must be no more than 50 characters long." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*#?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, #, ?, &)." }),

  confirm_password: z
    .string()
    .min(1, { message: "Confirm password is required" })
}).superRefine((val, ctx) => {
  if (val.new_password !== val.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords must match.',
      path: ['confirm_password'],
    })
  }
})



export {
  SignInFormSchema,
  ResetFormSchema,
  ForgetFormSchema,
  SignUpFormSchema,
  UpdateProfileFormForAdminSchema,
  UpdateProfileFormForManagerSchema,
  UpdatePasswordFormSchema,

};