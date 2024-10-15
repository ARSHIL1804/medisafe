"use client";
import { Button } from "@/components/ui/button";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from "react";
import { useAlert } from "@/app/providers/AlertProvider";
import { generateSignMessage } from "@/utils/utils";
import { generateNonce } from "@/lib/utils";
import { RESPONSE_CODE, USER_TYPE } from "@/utils/enum";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { POST } from "@/lib/services/auth";

export default function SignupButtons() {
  const { connected, signMessage, account } = useWallet();
  const { showAlert, hideAlert } = useAlert();
  const { user, setUser } = useAuth();
  const router = useRouter();

  const onGotoDashboardClick = () => {
    router.push("/dashboard/records");
  };
  const onRegisterClick = () => {
    router.push("/auth/register");
  };

  const onLoginClick = async () => {
    if (!connected || !account?.address) {
      showAlert(
        "Warning...",
        "Please connect your wallet before proceed.",
        "Ok",
        hideAlert
      );
      return;
    }

    showAlert("Loading...", "Sign the message in your wallet to login safely");
    try {
      let signMessageRes = await signMessage({
        message: generateSignMessage(account.address),
        nonce: generateNonce(),
        application: false,
        chainId: false,
      });

      const data: {
        signMessage: {};
        publicKey: string;
        walletAddress: string;
      } = {
        signMessage: signMessageRes,
        publicKey:
          typeof account?.publicKey == "string"
            ? account?.publicKey
            : account?.publicKey[0],
        walletAddress: account?.address,
      };
      const {userData} = await POST("/api/auth/login", data);
      setUser(userData);
      if(userData.usertype == USER_TYPE.DOCTOR){
        router.push("/dashboard/shared-records");
      }      
      else if(userData.usertype == USER_TYPE.PATIENT){
        router.push("/dashboard/records");
      }
    } catch (e) {
      console.log(e);
    }
    hideAlert();
  };

  return (
    <div>
      {user ? (
        <Button onClick={onGotoDashboardClick}>Go to Dashboard</Button>
      ) : (
        <>
          <Button onClick={onRegisterClick}>Register</Button>
          <Button variant="outline" className="ml-2" onClick={onLoginClick}>
            Login
          </Button>
        </>
      )}
    </div>
  );
}
