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

export default function LoginPage() {
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
      console.log("Google sign-in success:", result.user);
      setUser(result.user);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User signed out");
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
            // onClick={handleSignOut}
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
