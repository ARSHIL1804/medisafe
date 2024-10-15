import UserContextModel from "@/lib/models/UserContextModel";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { access } from "fs";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAlert } from "./AlertProvider";
import { RESPONSE_CODE } from "@/utils/enum";
import { GET, POST } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

interface AuthContextSchema {
  user: UserContextModel | null;
  setUser: (data: UserContextModel | null) => void;
  onLogout:()=>void;
}

const defaultAuthContextSchema: AuthContextSchema = {
  user: null,
  setUser: (data: UserContextModel | null) => {},
  onLogout:()=>{}
};

const AuthContext = createContext<AuthContextSchema>(defaultAuthContextSchema);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [myWallet, setWallet] = useState<any>();
  const [user, setUser] = useState<UserContextModel | null>(null);
  const { connected, connect, account, wallet, wallets, network } = useWallet();
  const { showAlert, hideAlert } = useAlert();
  const router = useRouter();
  useEffect(() => {
    let wallet = wallets?.filter((wallet) => {
      if (wallet.name == "Petra") {
        return true;
      }
    })[0];
    if (!wallet) return;

    if (wallet.readyState != "Installed") {
      showAlert(
        "Warning",
        "Please Install Petra wallet extention or app and reload the page"
      );
    } else {
      hideAlert();
      setWallet(wallet);
      console.log("Petra Wallet Installed");
    }
    connect(wallet.name);
  }, [wallets]);

  useEffect(() => {
    if (!connected || !account?.address || !network) return;

    async function getUserData() {
      const res = await GET("/api/auth/get-user-data",{},false);
      setUser(res.userData);
    }
    getUserData();
  }, [account]);

  useEffect(() => {
    if (!network) return;

    if (network.chainId != "2") {
      showAlert(
        "Warning",
        "Please switch your network to Testnet in order to use medisafe."
      );
      return;
    } else {
      hideAlert();
    }
  }, [network]);


  const onLogout = async() => { 
    try{ 
      await POST("/api/auth/logout",{});
      setUser(null);
      router.push('/')
    }
    catch(err){

    }
  } 
  return (
    <AuthContext.Provider value={{ user, setUser, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
