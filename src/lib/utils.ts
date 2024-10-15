// @ts-nocheck

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import cryptico from 'cryptico'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateNonce() {
  const array = new Uint32Array(4);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2))
    .join('');
}

export const formDataToJson = (formData: any) => {
  const jsonObject = {};
  formData.forEach((value, key) => {
    jsonObject[key] = value;
  });
  return jsonObject;
};


export async function generateDataEncryptionKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportKey(key) {
  const exportedKey = await window.crypto.subtle.exportKey("raw", key);
  const exportedKeyBuffer = new Uint8Array(exportedKey);
  const base64Key = btoa(String.fromCharCode.apply(null, exportedKeyBuffer));
  return base64Key;
}

export async function importKey(keyString: string) {
  const binaryString = atob(keyString);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const importedKey = await window.crypto.subtle.importKey(
    "raw",
    bytes,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  return importedKey;
}

export const encryptString = async (data: string, iv: any, key: any) => {
  const encoder = new TextEncoder();
  const encodedText = encoder.encode(data);
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encodedText
  );
  return btoa(String.fromCharCode(...new Uint8Array(encryptedContent)));
};


export const encryptFile = async (file: File, iv: any, key: any) => {
  const fileBuffer = await file.arrayBuffer();
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    fileBuffer
  );
  const encryptedFile = new Blob([iv, encryptedContent], { type: 'application/octet-stream' });
  return encryptedFile;
}


export const decryptString = async (encryptedData: string, iv: any, key: any): Promise<string> => {
  const encryptedBytes = new Uint8Array(
    atob(encryptedData).split('').map(char => char.charCodeAt(0))
  );
  const decryptedContent = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encryptedBytes
  );
  const decoder = new TextDecoder();
  return decoder.decode(decryptedContent);
};

export const decryptFile = async (encryptedFile: Blob, key: CryptoKey, fileName:string): Promise<any> => {
  const encryptedBuffer = await encryptedFile.arrayBuffer();
  const iv = encryptedBuffer.slice(0, 12);
  const encryptedContent = encryptedBuffer.slice(12);
  try {
    console.log(encryptedContent)
    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedContent
    );
    console.log(decryptedContent)

    return {decryptedFile:new File([decryptedContent], fileName, { type: "application/octet-stream" }),iv};
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt the file");
  }
};

// Helper function to convert hex string to Uint8Array
function hexToUint8Array(hexString) {
  return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}



export const generateKeyPair = (inputString: string) => {
  try {
    const rsaKey = cryptico.generateRSAKey(inputString, 1024);
    return rsaKey
  } catch (err) {
    console.log(err)
  }
};

export const getPubKey = (key) => {
  return cryptico.publicKeyString(key)
}

export const encrypt = function (message, pubkey) {
  var result = cryptico.encrypt(message, pubkey);
  return result.cipher;
};

export const decrypt = function (message, rsaKey) {
  var result = cryptico.decrypt(message, rsaKey);
  return result.plaintext;
};