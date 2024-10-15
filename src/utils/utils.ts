import * as z from "zod";
import { USER_TYPE, WALLET } from "./enum";

export function getValues<T extends Record<string, any>>(obj: T) {
    return Object.values(obj) as [(typeof obj)[keyof T]]
}


export function generateSignMessage(address: string) {
    return "I am signing up in medisafe with at " + new Date() + " with account address " + address;
}

export function getFormatedDate(seconds: any) {
    const date = new Date(seconds*1000 - 1000000000)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() == today.toDateString()) {
        return 'Today'
    }
    else if (date.toDateString() == yesterday.toDateString()) {
        return 'Yesterday'
    }
    else {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

export function getFileNameAndExtension(fileFullName:string) {
    const lastDotIndex = fileFullName.lastIndexOf('.');
    
    if (lastDotIndex === -1) {
      // No extension found
      return {
        fileName: fileFullName,
        fileExtension: ''
      };
    }
    
    const fileName = fileFullName.slice(0, lastDotIndex);
    const fileExtension = fileFullName.slice(lastDotIndex + 1).toLowerCase();
    
    return {
      fileName,
      fileExtension
    };
  }