"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { record, z } from "zod";

import {
  cn,
  decryptFile,
  encrypt,
  encryptFile,
  encryptString,
  exportKey,
  generateDataEncryptionKey,
  generateKeyPair,
  generateNonce,
  getPubKey,
} from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { GET, POST } from "@/lib/services/auth";
import { Textarea } from "@/components/ui/textarea";
import { uploadFile } from "@/lib/cloudinary";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AccountInfoInput } from "@aptos-labs/wallet-standard";
import InputPrivateKey from "@/components/InputPrivateKey";
import {
  LucideAlertCircle,
  LucideCopyCheck,
  LucideDownload,
} from "lucide-react";
import { useContract } from "@/lib/hooks/useContract";
import { JSEncrypt } from "jsencrypt";
import CryptoJS from "crypto-js";
import crypto from "crypto";
import AlertBox from "@/components/AlertBox";
import { Label } from "@/components/ui/label";
import { useOverlay } from "@/app/providers/OverlayProvider";
import { getFileNameAndExtension } from "@/utils/utils";

const UploadRecordSchema = z.object({
  recordName: z
    .string()
    .min(2, {
      message: "Username must be at least 4 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  recordFile: z.instanceof(File),
  recordDescription: z
    .string()
    .max(512, { message: "Description must not be longer than 512 character" }),
});

type UploadRecordModel = z.infer<typeof UploadRecordSchema>;

// This can come from your database or API.
const defaultValues: Partial<UploadRecordModel> = {};

export default function UploadRecord() {
  const [currentStep, setCurrentStep] = useState(1);
  const [secretPhrase, setSecretPhrase] = useState("");
  const [phraseError, setPhraseError] = useState(false);
  const steps = [
    { number: 1, title: "Records Details", isOptional: false },
    { number: 2, title: "Encrypt data", isOptional: false },
  ];

  const form = useForm<UploadRecordModel>({
    resolver: zodResolver(UploadRecordSchema),
    defaultValues,
    mode: "onChange",
  });

  const { addRecord, verifyPublicKey } = useContract();

  const { account } = useWallet();
  const overlay = useOverlay()

  // function encrypt(message:string, publicKey:string) {
  //   const cipher = window.crypto.subtle.encrypt(), createPublicKey({ key: publicKey });
  //   return crypto.publicEncrypt(cipher, Buffer.from(message));
  // }

  // function decrypt(encryptedData:string, privateKey:string) {
  //   const decipher = crypto.createPrivateKey({ key: privateKey });
  //   return crypto.privateDecrypt(decipher, Buffer.from(encryptedData));
  // }


  async function uploadRecordToPinata(data: UploadRecordModel) {
    setPhraseError(false);
    if(secretPhrase==''){
      setPhraseError(true);
      return;
    }
    overlay.open();
    const keyPair = generateKeyPair(secretPhrase);
    const encryptionPubKey = getPubKey(keyPair);
    console.log(encryptionPubKey)
    const isEncryptionPubKeyValid= await verifyPublicKey(encryptionPubKey);
    if(!isEncryptionPubKeyValid){
      setPhraseError(true);
      overlay.close();
      return;
    }
    const symetricKey = await generateDataEncryptionKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedFile = await encryptFile(data.recordFile, iv, symetricKey);
    const encryptedDescrIption = await encryptString(
      data.recordDescription,
      iv,
      symetricKey
    );
    const recordName = data.recordName;

    const formData = new FormData();
    formData.append("file", encryptedFile, data.recordFile.name);
    formData.append("name", recordName);
    formData.append("description", encryptedDescrIption);

    const res = await POST("/api/pinata-file", formData, true, false);

    const serializedSymetricKey = await exportKey(symetricKey);

    const encryptedKey = encrypt(serializedSymetricKey,encryptionPubKey)
    console.log(encryptedKey);

    const rese1 = await addRecord(encryptedKey,recordName,data.recordFile.name,res.hash);
    console.log(rese1);
  }

  const isFormValid = async () => {
    const result = await form.trigger();
    return result;
  };

  const handleNext = async () => {
    if (currentStep == 1) {
      if (await isFormValid()) {
        setCurrentStep(2);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const displayFile = (file: File | null) => {
    if (file) {
      return (
        file.name.substring(0, 10) +
        "... " +
        `(${(file.size / 1024).toFixed(2)} KB)`
      );
    }
    return "No file chosen";
  };
  const getData = async () => {
    // try{
    //   const file = await GET(`/api/pinata-file`,{cid:hash});
    //   console.log(file,key,iv,hash)
    //   const decryptedFile = await decryptFile(file,iv,key);
    //   const url = URL.createObjectURL(decryptedFile);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'Medisafe.png';
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   URL.revokeObjectURL(url);
    // }
    // catch(err){
    //   console.log(err);
    //   return;
    // }
  };

  return (
    <div className="w-full">
      <div>
        <span className="text-heading">Upload Record</span>
      </div>
      <div className="mt-6 px-6 pb-4 rounded-md border-2 border-border">
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
            <Form {...form}>
              <form className="space-y-8 w-[60%]">
                <div className="flex gap-8">
                  <FormField
                    control={form.control}
                    name="recordName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Record Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Left hand X-Ray" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give a name to your record for easy search.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="recordDescription"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Record Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your file description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="recordFile"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          {
                            <div className="relative">
                              <Input
                                type="file"
                                onChange={(e:any) =>
                                  field.onChange(e?.target?.files? e?.target?.files[0] : null)
                                }
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                              />
                              <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                                <span className="font-semibold mr-2">
                                  Choose File
                                </span>{" "}
                                {displayFile(form.getValues("recordFile"))}{" "}
                              </div>
                            </div>
                          }
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          ) : (
            <div className="flex flex-col gap-4 rounded-md">
              <AlertBox message="We will use this to encrypt your data for security. We will not be storing this anywhere in system" />
              <Label>Secret Phrase</Label>
              <Textarea
                value={secretPhrase}
                onChange={(e) => setSecretPhrase(e.target.value)}
                placeholder="Enter your secret phrase"
              />
              {phraseError && (
                <span className="text-sm text-destructive">Invalid Phrase</span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentStep === 1}
          >
            BACK
          </button>
          <button
            onClick={handleNext}
            className={`px-4 py-2 text-white bg-primary rounded hover:bg-primary ${
              currentStep === steps.length ? "hidden" : ""
            } `}
          >
            NEXT
          </button>
          <button
            onClick={form.handleSubmit(uploadRecordToPinata)}
            className={` px-4 py-2 text-white bg-primary rounded hover:bg-primary ${
              currentStep === steps.length ? "" : "hidden"
            } `}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
