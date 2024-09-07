// @ts-nocheck

import { AnyAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateNonce(){
  const array = new Uint32Array(4);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2))
    .join('');
}

export const formDataToJson = (formData:any) => {
  const jsonObject = {};
  formData.forEach((value, key) => {
    jsonObject[key] = value;
  });
  return jsonObject;
};


export const encryptString =  async (data:string, iv:any, key:any) => { 
  const encoder = new TextEncoder();
  const encodedText = encoder.encode(data);
  const encryptedContent =  await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encodedText
  );
  return btoa(String.fromCharCode(...new Uint8Array(encryptedContent)));
};


export const encryptFile =  async (file:File, iv:any,key:any) => { 
  const fileBuffer = await file.arrayBuffer();
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    fileBuffer
  );
  const encryptedFile = new Blob([iv, encryptedContent], { type: 'application/octet-stream' });
  return encryptedFile;
}