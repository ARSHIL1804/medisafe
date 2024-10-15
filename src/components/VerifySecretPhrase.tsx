import React, { useState } from "react";
import AlertBox from "./AlertBox";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function VerifySecretPhrase({secretPhrase, setSecretPhrase, verifyPhrase, phraseError}:any) {
  return (
    <div className="flex flex-col gap-4 rounded-md">
      <AlertBox message="We will use this to encrypt your data for security. We will not be storing this anywhere in system" />
      <Label>Secret Phrase</Label>
      <Textarea
        value={secretPhrase}
        onChange={(e) => setSecretPhrase(e.target.value)}
        placeholder="Enter your secret phrase"
      />
      {phraseError && (
        <span className="text-sm text-destructive">Invalid Phrase</span>
      )}

      <Button variant={'default'} onClick={verifyPhrase}> Verify</Button>
    </div>
  );
}
