import AlertBox from "@/components/AlertBox";
import { LucideCopy, LucideCopyCheck, LucideDownload } from "lucide-react";
import React, { useState } from "react";

export default function SecretPhrase({phrase}:{phrase:string}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyPhrase = () => {
    if (
      navigator.clipboard &&
      window.isSecureContext &&
      phrase.split(" ").length == 12
    ) {
      navigator.clipboard
        .writeText(phrase)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 3000);
          console.log("Text copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  const downloadPhraseFile = () => {
    const element = document.createElement("a");
    const file = new Blob([phrase], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "medisafe_account_phrase.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex flex-col gap-4 rounded-md py-4">
      <div className="text-2xl font-semibold">Your Phrase</div>
      <AlertBox message="Please save this phrase somewhere safe, this is going to be usefull for encrypting and decrypting records" />
      <div className="grid grid-cols-3 gap-4 pt-2">
        {phrase.split(" ").map((value:string, index:number) => {
          return (
            <div key={index} className=" roundex-md p-2 bg-accent">
              {value}
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-4">
        <div
          className="flex flex-row text-sm items-center p-1 cursor-pointer mr-3"
          onClick={downloadPhraseFile}
        >
          <LucideDownload size={16} className="mr-1" /> Download File
        </div>
        {isCopied ? (
          <div className="flex flex-row text-sm items-center p-1 cursor-pointer">
            <LucideCopyCheck size={16} className="mr-1" /> Copied
          </div>
        ) : (
          <div
            className="flex flex-row text-sm items-center p-1 cursor-pointer"
            onClick={copyPhrase}
          >
            <LucideCopy size={16} className="mr-2" /> Copy
          </div>
        )}
      </div>
    </div>
  );
}
