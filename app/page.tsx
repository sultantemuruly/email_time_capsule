"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Loader2, Mail, CalendarClock, Send, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function App() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const handleLogin = async () => {
    try {
      await login();
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-white/60 z-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen py-12 md:py-24 lg:py-32 xl:py-48 px-6 bg-gradient-to-br from-white via-slate-100 to-slate-50">
      <div className="relative container max-w-4xl flex flex-col items-center space-y-10 text-center z-10">
        {/* Hero Section */}
        <div className="space-y-6 motion-safe:animate-fadeInUp">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Send Emails to the Future
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Write now, deliver later. Schedule emails to be sent at any future
            date and time.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={handleLogin}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="bg-blue-700 hover:bg-white text-white hover:text-black px-6 py-3 rounded-md flex items-center gap-2 text-lg transition shadow-lg hover:shadow-xl"
            >
              Get Started{" "}
              <ArrowRight
                className={`w-5 h-5 transform transition-transform duration-300 ${hovered ? "translate-x-2" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 motion-safe:animate-fadeInSlow">
          <div className="flex flex-col items-center space-y-5">
            <Mail className="h-12 w-12 text-blue-600" />
            <h3 className="text-xl font-semibold">Write Effortlessly</h3>
          </div>

          <div className="flex flex-col items-center space-y-5">
            <CalendarClock className="h-12 w-12 text-blue-600" />
            <h3 className="text-xl font-semibold">Smart Scheduling</h3>
          </div>

          <div className="flex flex-col items-center space-y-5">
            <Send className="h-12 w-12 text-blue-600" />
            <h3 className="text-xl font-semibold">Send Automatically</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
