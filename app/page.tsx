"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function App() {
  const { login, loading } = useAuth();
  const router = useRouter();

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
        <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Send Emails to the Future
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Write now, deliver later. Schedule emails to be sent at any future
              date and time.
            </p>
          </div>
          <div className="space-x-4">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="bg-blue-700 text-white rounded-sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
