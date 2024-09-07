import UserContextModel from "@/lib/models/UserContextModel";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { access } from "fs";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAlert } from "./AlertProvider";
import { RESPONSE_CODE } from "@/utils/enum";
import { GET } from "@/lib/services/auth";

interface AuthContextSchema {
  user: UserContextModel | null;
  setUser: (data: UserContextModel | null) => void;
}

const defaultAuthContextSchema: AuthContextSchema = {
  user: null,
  setUser: (data: UserContextModel | null) => {},
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
      const userData = await GET("/api/auth/get-user-data",{},false);
      setUser(userData);
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
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
