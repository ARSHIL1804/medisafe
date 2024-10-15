import { sign } from "tweetnacl";
import {HexString} from 'aptos'
import { string } from "zod";

export function verifySignature(msg:string,signature:any,publicKey:string){

    return sign.detached.verify(new TextEncoder().encode(msg),new HexString(signature).toUint8Array(), new HexString(publicKey).toUint8Array())
}