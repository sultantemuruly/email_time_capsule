"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-context";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function Header() {
  const { user, login, logout, loading } = useAuth();

  return loading ? null : (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-16 px-5 md:px-10 lg:px-20">
        <div className="text-xl font-bold">Email Time Capsule</div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex justify-center items-center gap-2">
              <Image
                src={user.photoURL || "/default-avatar.png"}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full cursor-pointer"
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-black text-white rounded-sm"
                  >
                    Sign Out
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to sign out?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logout}>
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button
              onClick={login}
              variant="outline"
              className="bg-blue-700 text-white rounded-sm"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
