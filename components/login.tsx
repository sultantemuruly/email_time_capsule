"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        console.log("User logged in:", user);
        router.prefetch("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken(true);

      // Send token to server to set secure cookie
      const res = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        setUser(result.user);
        console.log("Login success and cookie set");
        router.push("/dashboard");
      } else {
        console.error("Failed to set session cookie");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await fetch("/api/logout", {
        method: "POST",
      }); // Clear the __session cookie

      setUser(null);
      console.log("User signed out");

      router.push("/");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-2">
          <Image
            src={user.photoURL || "/default-avatar.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full cursor-pointer"
            onClick={handleSignOut}
          />
        </div>
      ) : (
        <Button
          variant={"outline"}
          onClick={handleGoogleSignIn}
          className="bg-blue-700 text-white rounded-sm"
        >
          Sign in with Google
        </Button>
      )}
    </div>
  );
}
