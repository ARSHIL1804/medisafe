"use client";
//ts-ignore
import {
  WalletSortingOptions,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

import {
  LogOut,
  LucideCopy,
} from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import {useState, useEffect} from 'react';
import { useAlert } from "@/app/providers/AlertProvider";
export function WalletSelector(walletSortingOptions: WalletSortingOptions) {
  const [myWallet, setWallet] = useState<any>();
  const { account, connected, disconnect, wallets, isLoading, connect, network } = useWallet();
  const { toast } = useToast();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  }, [account?.address, toast]);
  const {showAlert,hideAlert} = useAlert()


  return connected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          {truncateAddress(account?.address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={copyAddress} className="gap-2">
          <LucideCopy size={16}/> Copy address
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={disconnect} className="gap-2">
          <LogOut className="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) :  <Button>Connect</Button>
}
