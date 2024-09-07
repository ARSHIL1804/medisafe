import * as z from "zod";
import { USER_TYPE, WALLET } from "./enum";

export function getValues<T extends Record<string, any>>(obj: T) {
    return Object.values(obj) as [(typeof obj)[keyof T]]
}


export function generateSignMessage(address:string) {
    return "I am signing up in medisafe with at " + new Date() + " with account address " + address;
}