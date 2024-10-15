import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

export default function UserProfileImage({profileImage, fallbackText}:any) {
  return (
    <Avatar className="h-10 w-10 rounded-full">
      <AvatarImage
        src={
          profileImage ||
          "https://gravatar.com/avatar/a179e37f0e7722a4ddee39e363cec952?s=200&d=robohash&r=x"
        }
      />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}
