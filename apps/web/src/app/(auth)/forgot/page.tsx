'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().min(3, { message: "Email is required" }).email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof schema>;

const ForgotPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log(data);
    setEmailSent(true);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full p-8">
      <div className="rounded-lg md:p-10 lg:p-20 w-full">
        <h2 className="text-4xl font-semibold mb-2">Forgot Password</h2>
        <p className="mb-4">Enter your email address to receive a password reset link.</p>

        {emailSent ? (
          <div className="text-green-600 font-medium">
            A password reset link has been sent to your email address.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="name@email.com"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPage;
