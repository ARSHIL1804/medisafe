import React from "react";
import { Icon, InfoIcon, LucideAlertCircle } from 'lucide-react'; // Import IconProps type from lucide-react
export default function AlertBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="bg-secondary rounded-lg relative flex flex-row w-full">
      <div className="bg-primary flex justify-center items-center p-4">
        <LucideAlertCircle
          className="text-primary-foreground absolute"
          size={20}
        />
      </div>
      <span className="text-sm p-2 text-secondary-foreground font-semibold capitalize">
         {message}
      </span>
    </div>
  );
}
