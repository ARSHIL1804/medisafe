"use client";
import PopUp from "@/components/PopUp";
import VerifySecretPhrase from "@/components/VerifySecretPhrase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContract } from "@/lib/hooks/useContract";
import { GET, GETFILE } from "@/lib/services/auth";
import {
  decrypt,
  decryptFile,
  decryptString,
  generateKeyPair,
  getPubKey,
  importKey,
} from "@/lib/utils";
import { getFormatedDate } from "@/utils/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  LucideCopy,
  LucideDownload,
  LucideFile,
  LucideSearch,
  LucideUpload,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfileImage from "../components/UserProfileImage";
import { toast } from "@/components/ui/use-toast";

export type DoctorType = {
  userName: string;
  title: string;
  specialization: string[];
  gender: string;
  phone: string;
  email: string;
  address: string;
  dob: Date;
  profileImage: string;
  workDescription: string;
  walletAddress: string;
};
export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const getDoctors = async () => {
    const res = await GET("/api/users/doctors");
    const doctors = res?.doctors || [];
    setDoctors(
      doctors.map((value: any, index: number) => {
        return {
          userName: value.username,
          title: value.title,
          specialization: value.specialization,
          gender: value.gender,
          phone: value.phone,
          email: value.email,
          address: value.address,
          dob: value.dob,
          profileImage: value.profileImage,
          workDescription: value.workDescription,
          walletAddress: value.walletAddress,
        };
      })
    );
  };
  const copyAddress =  async (walletAddress:string) => {
    console.log(walletAddress)
    try {
      await navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Success",
        description: "Copied address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  } 
  useEffect(() => {
    getDoctors();
  }, []);
  return (
    <div className="w-full">
      <div className="flex items-center py-2 w-[60%] relative">
        <LucideSearch
          className="absolute left-2 top-7 transform -translate-y-1/2 stroke-secondary-foreground"
          size={16}
        />
        <Input
          placeholder="Search for files"
          className="pl-8 text-md border-2 border-border focus:border-secondary-foreground text-secondary-foreground"
        />
      </div>
      <div className="flex py-2 w-full flex-col justify-start items-start overflow-y-auto">
        <div className="mt-4">
          <span className="text-heading">Doctors</span>
        </div>
        <div className="mt-4">
          {doctors.map((value: DoctorType, index: number) => {
            return (
              <div key={index} className="w-[250px] flex flex-col border-2 p-2">
                <div className="flex gap-2 justify-start">
                  <div className="flex h-full justify-start">
                    <UserProfileImage
                      profileImage={
                        value?.profileImage ||
                        "https://gravatar.com/avatar/a179e37f0e7722a4ddee39e363cec952?s=200&d=robohash&r=x"
                      }
                      fallbackText={value?.userName}
                    />
                  </div>
                  <div className="flex flex-1 flex-col bg-card">
                    <span className="text-lg font-semibold">
                      {value.userName}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-3xl bg-primary text-white w-fit truncate">
                      {value.title}
                    </span>
                    <div className="mt-2">
                      {value.specialization.map((value, index) => {
                        if (index < 2) {
                          return (
                            <span className="rounded-3xl px-2 py-1 text-xs bg-secondary text-secondary-foreground grid gap-2 w-fit truncate">
                              {value}
                            </span>
                          );
                        }
                      })}
                      {
                       value.specialization.length>2 && `+${value.specialization.length-2}`
                      }
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button onClick={()=>copyAddress(value.walletAddress)}>
                        Copy Address
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
