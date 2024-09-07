"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RESPONSE_CODE, USER_GENDER, USER_TYPE } from "@/utils/enum";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import {
  PatientSignupModel,
  PatientSignupSchema,
} from "@/lib/models/PatientSignupModel";
import { useAuth } from "@/app/providers/AuthProvider";
import { getAptosClient } from "@/utils/aptosClient";
import { useContract } from "@/lib/hooks/useContract";
import { useAlert } from "@/app/providers/AlertProvider";
import Header from "@/components/Header";

import DoctorForm from "./components/DoctorForm";
import PatientForm from "./components/PatientForm";
import { generateSignMessage } from "@/utils/utils";
import { generateNonce } from "@/lib/utils";
import { POST } from "@/lib/services/auth";

const aptosClient = getAptosClient();

export default function Register() {
  const { connected, signMessage, account, signAndSubmitTransaction } =
    useWallet();
  const { setUser } = useAuth();
  const router = useRouter();
  const { showAlert, hideAlert } = useAlert();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { addUser } = useContract();
  const [isPatientSignUp, setIsPatientSigUp] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleSubmit = async (data: any) => {
    if (!connected || !account?.address) {
      showAlert(
        "Warning...",
        "Please connect your wallet before proceed.",
        "Ok",
        hideAlert
      );
      return;
    }
    showAlert("Loading...", "Sign the message in your wallet to signup safely");
    try {
      let signMessageRes = await signMessage({
        message: generateSignMessage(account.address),
        nonce: generateNonce(),
        application: false,
        chainId: false,
      });

      data.signMessage = signMessageRes;
      data.publicKey =(typeof account?.publicKey == 'string' ? account?.publicKey  : account?.publicKey[0])  ;
      data.walletAddress = account?.address;
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (key === "signMessage" || key === "specialization") {
          // @ts-ignore
          console.log(JSON.stringify(value));
          formData.append(key, JSON.stringify(value));
        } else {
          // @ts-ignore
          formData.append(key, value);
        }
      }
      const userData = await POST("/api/auth/signup", formData, true ,false);
      setUser(userData);
      await addUser(data.usertype == USER_TYPE.DOCTOR);
      hideAlert();
      if(data.usertype == USER_TYPE.DOCTOR){
        router.push("/dashboard/shared-records");
      }      
      else if(data.usertype == USER_TYPE.PATIENT){
        router.push("/dashboard/my-records");
      }
    } catch (e) {
      hideAlert();
    }
  };

  return (
    <div className="flex flex-row border rounded-lg items-center h-full">
      {isPatientSignUp ? (
        <PatientForm
          setIsPatientSigUp={setIsPatientSigUp}
          handleSubmit={handleSubmit}
        />
      ) : (
        <DoctorForm
          setIsPatientSigUp={setIsPatientSigUp}
          handleSubmit={handleSubmit}
        />
      )}
      <div className="flex flex-col justify-between items-center py-8 h-full w-[40%] bg-[#EDF0F5]">
        <Carousel
          className="w-full cursor-pointer select-none overflow-y-visible"
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 2500,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="overflow-y-visible">
            <CarouselItem
              key={1}
              className="w-full flex flex-col justify-center items-center"
            >
              <div className="w-[60%]">
                <img src="/secure-1.png" alt="" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-lg font-semibold">Data Privacy</span>
                <span className="text-md text-center mt-4">
                  Securely safeguard your vital health information on an
                  unchangeable blockchain platform.
                </span>
              </div>
            </CarouselItem>
            <CarouselItem
              key={2}
              className="w-full flex flex-col justify-center items-center"
            >
              <div className="w-[60%]">
                <img src="/secure-2.png" alt="" />
              </div>
              <div className="flex flex-col items-center justify-center w-[60%]">
                <span className="text-lg font-semibold">Data Privacy</span>
                <span className="text-md text-center mt-4">
                  Store your health related data in blockchain with security.
                </span>
              </div>
            </CarouselItem>
            <CarouselItem
              key={3}
              className="w-full flex flex-col justify-center items-center"
            >
              <div className="w-[60%]">
                <img src="/secure-3.svg" alt="" />
              </div>
              <div className="flex flex-col items-center justify-center w-[60%]">
                <span className="text-lg font-semibold">Data Privacy</span>
                <span className="text-md text-center mt-4">
                  Store your health related data in blockchain with security.
                </span>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div className="flex flex-row w-[40%] h-1 mt-12 space-x-2">
          <div
            className={`flex-1 h-full ${
              current == 1 ? "bg-primary" : "bg-slate-400"
            }`}
          ></div>
          <div
            className={`flex-1 h-full ${
              current == 2 ? "bg-primary" : "bg-slate-400"
            }`}
          ></div>
          <div
            className={`flex-1 h-full ${
              current == 3 ? "bg-primary" : "bg-slate-400"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
