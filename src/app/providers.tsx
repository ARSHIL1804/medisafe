"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren } from "react";
import { OverlayProvider } from "./providers/OverlayProvider";
import AuthProvider from "./providers/AuthProvider";
import AlertProvider from "./providers/AlertProvider";


export default function Providers({ children }:PropsWithChildren) {

  const wallets = [new PetraWallet()]
  return (
    <>
    <AptosWalletAdapterProvider optInWallets={["Petra"]} plugins={wallets}>
      <AlertProvider>
          <OverlayProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
          </OverlayProvider>
      </AlertProvider>
      </AptosWalletAdapterProvider>

    </>
  )
}
