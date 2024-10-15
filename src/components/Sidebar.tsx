"use client";
import Link from "next/link";
import { Separator } from "./ui/separator";
import {
  LucideFile,
  LucideLogOut,
  LucideShare,
  LucideShare2,
  LucideUser2,
  LucideUsers,
  LucideUsers2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";
import { SheetClose } from "./ui/sheet";
import { WalletSelector } from "./WalletSelector";
import { useAuth } from "@/app/providers/AuthProvider";
import { useEffect } from "react";
import { USER_TYPE } from "@/utils/enum";
import { POST } from "@/lib/services/auth";

interface SidebarButtonProps extends ButtonProps {
  icon?: LucideIcon;
}

function SidebarButton({
  icon: Icon,
  className,
  children,
  ...props
}: SidebarButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn("gap-2 justify-start text-normal", className)}
      {...props}
    >
      {Icon && <Icon stroke="#b77b10" size={18} />}
      <span>{children}</span>
    </Button>
  );
}

function SidebarButtonSheet(props: SidebarButtonProps) {
  return (
    <SheetClose asChild>
      <SidebarButton {...props} />
    </SheetClose>
  );
}

export function SidebarDesktop(props: any) {
  const pathname = usePathname();
  const { user, onLogout } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <aside className="w-[350px] max-w-xs h-screen border-r-2 flex flex-col border-border">
      <div className="flex gap-2 text-center px-3 py-3">
        <a className="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Medisafe
          </span>
        </a>
      </div>
      <Separator className="w-full bg-border" />
      <div className="h-[100%] px-3 py-3 flex-1">
        <div>
          <div className="flex flex-col gap-1 w-full">
            {user?.usertype == USER_TYPE.DOCTOR ? (
              <Link key={1} href={"/dashboard/shared"}>
                <SidebarButton
                  variant={
                    pathname === "/dashboard/shared-records" ? "secondary" : "ghost"
                  }
                  icon={LucideShare2}
                  className="w-full mt-2"
                >
                  Shared Records
                </SidebarButton>
              </Link>
            ) : (
              <>
                <Link key={2} href={"/dashboard/records"}>
                  <SidebarButton
                    variant={
                      pathname === "/dashboard/records"
                        ? "secondary"
                        : "ghost"
                    }
                    icon={LucideFile}
                    className="w-full mt-2"
                  >
                    Records
                  </SidebarButton>
                </Link>
                <Link key={2} href={"/dashboard/upload"}>
                  <SidebarButton
                    variant={
                      pathname === "/dashboard/upload"
                        ? "secondary"
                        : "ghost"
                    }
                    icon={LucideFile}
                    className="w-full mt-2"
                  >
                    Upload Record
                  </SidebarButton>
                </Link>
              </>
            )}

            <Link key={3} href={"/dashboard/doctors"}>
              <SidebarButton
                variant={
                  pathname === "/dashboard/doctors" ? "secondary" : "ghost"
                }
                icon={LucideUsers2}
                className="w-full mt-2"
              >
                Doctors
              </SidebarButton>
            </Link>

            <Link key={4} href={"/dashboard/shared"}>
              <SidebarButton
                variant={
                  pathname === "/dashboard/shared" ? "secondary" : "ghost"
                }
                icon={LucideUser2}
                className="w-full mt-2"
              >
                Profile
              </SidebarButton>
            </Link>

            <Link key={5} href={"#"} onClick={onLogout}>
              <SidebarButton
                variant={
                  pathname === "/dashboard/shared" ? "secondary" : "ghost"
                }
                icon={LucideLogOut}
                className="w-full mt-2"
              >
                Signout
              </SidebarButton>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
