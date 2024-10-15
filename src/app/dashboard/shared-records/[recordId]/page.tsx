"use client";
import PopUp from "@/components/PopUp";
import VerifySecretPhrase from "@/components/VerifySecretPhrase";
import { useContract } from "@/lib/hooks/useContract";
import { GETFILE } from "@/lib/services/auth";
import {
  decrypt,
  decryptFile,
  decryptString,
  generateKeyPair,
  getPubKey,
  importKey,
} from "@/lib/utils";
import { getFormatedDate } from "@/utils/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { LucideDownload, LucideFile, LucideSearch, LucideUpload } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export type RecordDetailsType = {
  stared?: boolean;
  recordId: number;
  recordName: string;
  recordDescription: string;
  accessKey: string;
  fileName: string;
  fileHash: string;
  uploadedAt: string;
};
export default function RecordPgae() {

  const [recordId, setRecordId] =useState<string|null>(null);
  const [record, setRecord] = useState<RecordDetailsType>();
  const [openPopup, setOpenPopup] = useState(true);
  const { verifyPublicKey, getDoctorRecord } = useContract();
  const [keyPair, setKeyPair] = useState();
  const [secretPhrase, setSecretPhrase] = useState();
  const [phraseError, setPhraseError] = useState(false);
  const [isVarified, setIsVarified] = useState(false);
  const [file, setFile] = useState<any>();
  const verifyPhrase = async () => {
    if(!secretPhrase)return;
    const keyPair = generateKeyPair(secretPhrase);
    const encryptionPuKey = getPubKey(keyPair);
    const isValidPubKey = await verifyPublicKey(encryptionPuKey);
    if (!isValidPubKey) {
      setPhraseError(true);
      return;
    }
    setKeyPair(keyPair);
    setIsVarified(true);
  };

  const getRecord = async () => {
    try {
      const record = await getDoctorRecord(Number(0));
      console.log(record)
      const symetricKey = decrypt(record.access_key, keyPair);
      const importedKey = await importKey(symetricKey);
      const fileRes = await GETFILE(`/api/pinata-file`, {
        cid: record?.file_hash,
      });
      const file = await fileRes.blob();

      const metadata = JSON.parse(
        fileRes.headers.get("X-Pinata-Metadata") || ""
      );
      const { decryptedFile, iv } = await decryptFile(
        file,
        importedKey,
        record.file_name
      );
      let description = "";
      if (metadata.description) {
        description = await decryptString(
          metadata.description,
          iv,
          importedKey
        );
      }

      setRecord({
        stared: false,
        recordId: record.record_id,
        recordName: record.record_name,
        recordDescription: description,
        accessKey: record.access_key,
        fileName: record.file_name,
        fileHash: record.file_hash,
        uploadedAt: record.timestamp,
      });
      setFile(decryptedFile);
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const downloadFile = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = record?.fileName || "Medisafe(101).pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!keyPair || !isVarified) return;
    getRecord();
  }, [keyPair]);

  return (
    <div className="w-full">
      {!isVarified ? (
        <PopUp
          title="Upload Record"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <VerifySecretPhrase
            secretPhrase={secretPhrase}
            setSecretPhrase={setSecretPhrase}
            verifyPhrase={verifyPhrase}
            phraseError={phraseError}
          />
        </PopUp>
      ) : (
        <div className="">
          <div>
            <span className="text-heading">Record Details</span>
          </div>
          {record && (
            <div className="flex flex-col mt-8 border-2 p-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm">Name :</span>
                <span>{record?.recordName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm">Descrution :</span>
                <span>{record?.recordDescription}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm">Upload Date :</span>
                <span>{getFormatedDate(record?.uploadedAt)}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm">File :</span>
                <div className="flex items-center border-2 bg-card max-w-[250px] p-3 gap-2">
                    <LucideFile/>
                    <span className="w-[70%] truncate">{record.fileName}</span>
                    <LucideDownload className="ml-2 cursor-pointer" onClick={downloadFile}/>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
