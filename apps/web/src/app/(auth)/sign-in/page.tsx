"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Cookies from "js-cookie"; 
import { io } from "socket.io-client";

const schema = z.object({
  email: z
    .string()
    .min(3, { message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, { message: "Password needs to be at least 8 characters long" }),
});

type SignInFormData = z.infer<typeof schema>;

const SignInPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberEmail");
    const storedPassword = localStorage.getItem("rememberPassword");

    if (storedEmail && storedPassword) {
      setValue("email", storedEmail);
      setValue("password", storedPassword);
    }
  }, [setValue]);

  const onSubmit = async (data: SignInFormData) => {
    if (rememberMe) {
      localStorage.setItem("rememberEmail", data.email);
      localStorage.setItem("rememberPassword", data.password);
    } else {
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
    }

    console.log(data);
    connectToSocket();
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  const connectToSocket = () => {
    const token = Cookies.get("access_token"); 
    if (!token) {
      console.error("No access_token found in cookies");
      return;
    }

    const socket = io("http://localhost:3000", {
      extraHeaders: {
        Authorization: `Bearer ${token}`, 
      },
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection failed", err);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  };

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      connectToSocket();
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-full p-8">
      <div className="rounded-lg md:p-10 lg:p-20 w-full">
        <h2 className="text-4xl font-semibold mb-2">Welcome back</h2>
        <p className="mb-4">
          Start your journey in seconds. Don&apos;t have an account? Sign up.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-y-4 w-full justify-between">
            <div className="mt-6 flex w-full gap-x-4">
              <div className="w-full">
                <a
                  href="http://localhost:3001/auth/google"
                  className="text-sm font-medium w-full"
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md shadow-lg hover:bg-white transition"
                    onClick={handleGoogleSignIn}
                  >
                    <FcGoogle className="w-5 h-5" />
                    <span>Sign in with Google</span>
                  </button>
                </a>
              </div>
              <div className="w-full">
                <Link href="#" className="text-sm font-medium w-full">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                    <FaApple className="w-5 h-5" />
                    <span>Sign in with Apple</span>
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center gap-x-2 w-full">
              <hr className="flex-grow border-t border-gray-400 mt-1" />
              <span className="text-gray-500 font-medium">or</span>
              <hr className="flex-grow border-t border-gray-400 mt-1" />
            </div>
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="name@email.com"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="***********"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="/forgot"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in to your account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
