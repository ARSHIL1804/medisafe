"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn, decryptFile, encryptFile, encryptString, generateNonce } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { GET, POST } from "@/lib/services/auth";
import { Textarea } from "@/components/ui/textarea";
import { uploadFile } from "@/lib/cloudinary";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AccountInfoInput } from '@aptos-labs/wallet-standard'
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

export function UploadRecord() {
  const form = useForm<UploadRecordModel>({
    resolver: zodResolver(UploadRecordSchema),
    defaultValues,
    mode: "onChange",
  });

  const {wallet, signMessage, account, signMessageAndVerify } = useWallet();

  async function genrateKey() {
    return await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }


  async function onSubmit(data: UploadRecordModel) {
    const key = await genrateKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedFile = await encryptFile(data.recordFile, iv, key);
    const encryptedDescruption = await encryptString(
      data.recordDescription,
      iv,
      key
    );
    const encryptFilName = await encryptString(data.recordFile.name, iv, key);
    const encryptedRecordName = await encryptString(data.recordName, iv, key);

    const formData = new FormData();
    formData.append("file", encryptedFile, encryptFilName);
    formData.append("name", encryptedRecordName);
    formData.append("description", encryptedDescruption);


    const res = await POST("/api/pinata-file", formData, true, false);
    
    

  }

  const getData = async () =>{
    try{
      const file = await GET(`/api/pinata-file`,{cid:hash});
      console.log(file,key,iv,hash)
      const decryptedFile = await decryptFile(file,iv,key);
  
  
      const url = URL.createObjectURL(decryptedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Medisafe.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    catch(err){
      console.log(err);
      return;
    }
  } 



  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Textarea placeholder="Your file description" {...field} />
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
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e?.target?.files[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit">Upload Record</Button>
      </form>
      <Button onClick={getData}>Get data</Button>

    </Form>
  );
}
