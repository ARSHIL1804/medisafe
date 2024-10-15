"use client"
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { LucideAlertTriangle } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { generateSignMessage } from "@/utils/utils";
import { generateNonce } from "@/lib/utils";
import { verifySignature } from "@/lib/verifySign";
import { Button } from "./ui/button";
import { JSEncrypt } from 'jsencrypt';
import { SHA256 } from 'crypto-js' ;
export default function InputPrivateKey({privKeyVarified, setPrivKeyVarified}:any) {
  
  const {account, signMessage} = useWallet()
  const {user} = useAuth();

  const [privKey,setPrivKey] = useState('');

  const sha256Wrapper = (msg:string)=>{return CryptoJS.SHA256(msg).toString()}
  const encryptMessage = (message:string ,privKey :string) => {
    const encrypt = new JSEncrypt();
    encrypt.setPrivateKey(privKey);
    console.log(message)
    const encryptedMsg = encrypt.encrypt(message);
    return encryptedMsg;
  }

  const decryptMessage = (message:string, encryptedMsg:string ,publicKey :string) => {
    const decrypt = new JSEncrypt();
    decrypt.setPublicKey(publicKey);
    return decrypt.decrypt(encryptedMsg);
  }
  const validatePrivateKey = async() => {
    console.log(account,privKey)
    if(!account || !privKey)return;
    const message =  generateSignMessage(account.address);
    const encryptedMsg = encryptMessage(message,privKey);
    console.log(encryptedMsg,account.publicKey,privKey)
    const isValid = decryptMessage(message, encryptedMsg || '', typeof account?.publicKey == 'string' ? account?.publicKey  : account?.publicKey[0]); 

    console.log(isValid)
  }

  useEffect(()=>{
    if(account){
        console.log(account)
    }
  },[account])
  return (
    <div>
      <div className="bg-destructive p-2 text-white rounded-lg flex flex-row gap-2">
        <span>
          Attention, We are not storing your private key in our system, it is
          just used to encrypt your data in your browser before transfering it
          to somewhere else.
        </span>
      </div>
      <div className="mt-2">
        <Label>Private Key</Label>
        <div className="flex flex-row gap-2 mt-2">
           <Input value={privKey} onChange={(e)=>setPrivKey(e.target.value)} className="w-[80%]" placeholder="Enter Your Private key" disabled={privKeyVarified} type={privKeyVarified ? "password" : "text"} />
           <Button onClick={validatePrivateKey} variant={'outline'} disabled={privKeyVarified} value={privKey} onChange={(e:any)=>setPrivKey(e.target.value)}>
              {
                privKeyVarified ? 'Verified' : 'Verify'
              } 
           </Button>
        </div>
      </div>
    </div>
  );
}
