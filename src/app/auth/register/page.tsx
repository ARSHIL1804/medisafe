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
import { decrypt, encrypt, generateKeyPair, generateNonce, getPubKey } from "@/lib/utils";
import { POST } from "@/lib/services/auth";
import SecretPhrase from "./components/SecretPhrase";
import { generateMnemonic, mnemonicToSeed, validateMnemonic } from "bip39";
import { Button } from "@/components/ui/button";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<any>();
  const steps = [
    { number: 1, title: "Records Details", isOptional: false },
    { number: 2, title: "Encrypt data", isOptional: false },
  ];
  const [phrase, setPhrase] = useState<string>("");
  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  function uint8ArrayToBase64(uint8Array:any) {
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary); // Convert to Base64
  }

  function base64ToUint8Array(base64:any) {
    const binaryString = atob(base64); // Decode the base64 string
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
  
    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i); // Convert each character to its char code
    }
  
    return uint8Array;
  }


  const handleSubmit = async () => {
    const data = form?.getValues()
    if (!connected || !account?.address) {
      showAlert(
        "Warning...",
        "Please connect your wallet before proceed.",
        "Ok",
        hideAlert
      );
      return;
    }
    if (!validateMnemonic(phrase)) return;
    const keyPair = generateKeyPair(phrase);
    const encryptionPubKey = getPubKey(keyPair);
    showAlert("Loading...", "Sign the message in your wallet to signup safely");
    try {
      let signMessageRes = await signMessage({
        message: generateSignMessage(account.address),
        nonce: generateNonce(),
        application: false,
        chainId: false,
      });

      data.signMessage = signMessageRes;
      data.publicKey =
        typeof account?.publicKey == "string"
          ? account?.publicKey
          : account?.publicKey[0];
      data.encryptionPubKey = encryptionPubKey;
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
      const userData = await POST("/api/auth/signup", formData, true, false);
      setUser(userData);
      await addUser(encryptionPubKey,data.usertype == USER_TYPE.DOCTOR);
      hideAlert();
      if (data.usertype == USER_TYPE.DOCTOR) {
        router.push("/dashboard/shared-records");
      } else if (data.usertype == USER_TYPE.PATIENT) {
        router.push("/dashboard/records");
      }
    } catch (e) {
      hideAlert();
    }
  };

  const isFormValid = async (form: any) => {
    const result = await form.trigger();
    return result;
  };

  const handleNext = async (e: any, form: any) => {
    e.preventDefault();
    const isValid = await isFormValid(form);
    if (!isValid) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
    setForm(form);
    const mnemonic = generateMnemonic(128);
    setPhrase(mnemonic);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="flex flex-row border rounded-lg items-center h-full">
      <div className="w-[70%] h-full p-8 max-h-full overflow-y-auto">
        <div className="flex mt-4 gap-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-row items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  step.number === currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <div className="text-sm text-center">
                <div
                  className={step.number === currentStep ? "font-semibold" : ""}
                >
                  {step.title}
                </div>
              </div>
              {index !== steps.length - 1 && (
                <div className="w-[200px] h-[2px] bg-gray-400"></div>
              )}
            </div>
          ))}
        </div>
        <div className="py-4">
          {currentStep == 1 ? (
            isPatientSignUp ? (
              <PatientForm
                setIsPatientSigUp={setIsPatientSigUp}
                handleSubmit={handleNext}
              />
            ) : (
              <DoctorForm
                setIsPatientSigUp={setIsPatientSigUp}
                handleSubmit={handleNext}
              />
            )
          ) : (
            <SecretPhrase phrase={phrase} />
          )}
        </div>
        {currentStep == 2 && (
          <div className="flex gap-4">
            <Button
              type="submit"
              variant={"outline"}
              className="px-4 py-2 "
              onClick={handleBack}
            >
              BACK
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 text-white bg-primary rounded hover:bg-primary"
              onClick={handleSubmit}
            >
              Signup
            </Button>
          </div>
        )}
      </div>
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
