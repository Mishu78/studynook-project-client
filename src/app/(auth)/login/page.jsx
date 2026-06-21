"use client";



import Link from "next/link";

import { Button, TextField, InputGroup, FieldError } from "@heroui/react";

import { Mail, Lock, BookOpen, ArrowRight } from "lucide-react";

import {signIn } from "@/lib/auth-client";

import { toast } from "react-hot-toast";

import { useRouter } from "next/navigation";



export default function Login() {

  const router = useRouter();



 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(e.currentTarget);
    const loginData = Object.fromEntries(formData.entries());

    // ✅ FIX: Use onSuccess inside fetchOptions to intercept redirection cleanly
    const { data, error } = await signIn.email({
      email: loginData.email,
      password: loginData.password,
    }, {
      onRequest: () => {
        // Optional loading states can go here
      },
      onSuccess: (ctx) => {
        // Better Auth places the JWT token inside the context data payload
        const token = ctx.data?.token || ctx.data?.session?.token;
        if (token) {
          localStorage.setItem('access-token', token);
        }
        
        toast.success("Logged in successfully!");
        router.push("/");
        router.refresh();
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "Login failed");
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    toast.error("Something went wrong. Please try again.");
  }
};



  return (

    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF8F5] font-sans">

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[600px] lg:rounded-[2rem] lg:border lg:border-stone-200/60 lg:shadow-xl overflow-hidden bg-white">

       

        {/* Left Column: Brand Hero Section */}

        <div className="hidden lg:flex lg:col-span-5 bg-[#063725] p-12 flex-col justify-between relative overflow-hidden">

          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-800/20 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="absolute bottom-0 left-0 w-80 h-80 bg-stone-900/30 rounded-full blur-3xl -ml-20 -mb-20" />



          {/* Logo */}

          <Link href="/" className="flex items-center gap-2 relative z-10 w-fit">

            <div className="p-2 bg-blue-600 rounded-xl">

              <BookOpen className="w-6 h-6 text-white" />

            </div>

            <span className="font-extrabold text-2xl tracking-tight text-stone-100">

              StudyNook

            </span>

          </Link>



          {/* Hero Content */}

          <div className="space-y-4 relative z-10 my-auto">

            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">

              Your quiet sanctuary for focus and learning.

            </h1>

            <p className="text-emerald-200/70 font-medium text-base leading-relaxed max-w-sm">

              Book premium, distraction-free study spaces by the hour. Pick up right where you left off.

            </p>

          </div>



          <div className="text-xs text-emerald-300/40 font-medium relative z-10">

            © 2026 StudyNook. All rights reserved.

          </div>

        </div>



        {/* Right Column: Login Form */}

        <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-8 sm:p-16 bg-[#FAF8F5] lg:bg-white">

          <div className="w-full max-w-md space-y-7">

           

            {/* Header Block */}

            <div className="space-y-2">

              <div className="flex lg:hidden items-center gap-2 mb-6">

                <div className="p-2 bg-[#063725] rounded-xl">

                  <BookOpen className="w-5 h-5 text-white" />

                </div>

                <span className="font-extrabold text-xl tracking-tight text-stone-900">

                  StudyNook

                </span>

              </div>

             

              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">

                Welcome back

              </h2>

              <p className="text-stone-500 text-sm font-medium">

                Don&apos;t have an account?{" "}

                <Link href="/register" className="text-emerald-800 font-bold hover:underline underline-offset-4 transition-all">

                  Register here

                </Link>

              </p>

            </div>



            {/* Email & Password Input Form */}

            <form onSubmit={handleLogin} className="space-y-5">

             

              {/* EMAIL FIELD */}

              <TextField name="email" type="email" className="w-full flex flex-col gap-1.5">

                <label htmlFor="email" className="text-sm font-semibold text-stone-700">

                  Email Address

                </label>

                <InputGroup className="h-12 border border-stone-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-emerald-800 focus-within:border-emerald-800 transition-all shadow-sm">

                  <InputGroup.Prefix className="pl-3 flex items-center justify-center">

                    <Mail className="w-4 h-4 text-stone-400 shrink-0" />

                  </InputGroup.Prefix>

                  <InputGroup.Input

                    id="email"

                    placeholder="you@example.com"

                    required

                    className="w-full h-full px-3 text-sm text-stone-800 outline-none bg-transparent"

                  />

                </InputGroup>

                <FieldError className="text-xs text-red-500 mt-1" />

              </TextField>



              {/* PASSWORD FIELD */}

              <TextField name="password" type="password" className="w-full flex flex-col gap-1.5 mt-4">

                <div className="flex justify-between items-center">

                  <label htmlFor="password" className="text-sm font-semibold text-stone-700">

                    Password

                  </label>

                </div>

                <InputGroup className="h-12 border border-stone-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-emerald-800 focus-within:border-emerald-800 transition-all shadow-sm">

                  <InputGroup.Prefix className="pl-3 flex items-center justify-center">

                    <Lock className="w-4 h-4 text-stone-400 shrink-0" />

                  </InputGroup.Prefix>

                  <InputGroup.Input

                    id="password"

                    placeholder="••••••••"

                    required

                    className="w-full h-full px-3 text-sm text-stone-800 outline-none bg-transparent"

                  />

                </InputGroup>

                <FieldError className="text-xs text-red-500 mt-1" />

              </TextField>



              {/* Email Login Button */}

              <Button

                type="submit"

                className="w-full h-12 text-sm font-bold bg-[#063725] text-white rounded-xl hover:bg-emerald-900 transition-all group mt-2 shadow-sm"

              >

                Sign In to Your Space

                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />

              </Button>

            </form>



            {/* Custom Divider line */}

            <div className="relative py-1">

              <div className="absolute inset-0 flex items-center">

                <span className="w-full border-t border-stone-200"></span>

              </div>

              <div className="relative flex justify-center text-xs">

                <span className="bg-[#FAF8F5] lg:bg-white px-4 text-stone-400 font-bold uppercase tracking-widest">

                  Or

                </span>

              </div>

            </div>



            {/* Google Authentication Button */}

            <Button

              variant="bordered"

              className="w-full h-12 text-sm font-semibold rounded-xl border-stone-200 hover:border-stone-300 hover:bg-stone-50 bg-white text-stone-700 transition-all shadow-sm"

            >

              <span className="flex items-center justify-center gap-3">

                <img

                  src="https://www.google.com/favicon.ico"

                  className="w-4.5 h-4.5 object-contain"

                  alt="Google Logo"

                />

                Continue with Google

              </span>

            </Button>



          </div>

        </div>



      </div>

    </div>

  );

} 

