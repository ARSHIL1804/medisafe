"use client";
import { useAuth } from "@/app/providers/AuthProvider";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import UserProfileImage from "./UserProfileImage";

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="px-6">
      <div className="flex justify-end mx-auto max-w-screen-xl py-2">
        {user && (
          <div className="flex gap-2 text-center  bg-secondary text-secondary-foreground rounded-full h-10">
            <UserProfileImage profileImage={user?.profileImage || "https://gravatar.com/avatar/a179e37f0e7722a4ddee39e363cec952?s=200&d=robohash&r=x"} fallbackText={user?.username}/>
            <span className="flex justify-center items-center mr-2 text-secondary-foreground">
              Hello,{" "}
              <span className="ml-1 font-semibold text-secondary-foreground">
                {" "}
                {user?.username}
              </span>
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
