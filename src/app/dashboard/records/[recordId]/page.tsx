"use client";
import PopUp from "@/components/PopUp";
import VerifySecretPhrase from "@/components/VerifySecretPhrase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContract } from "@/lib/hooks/useContract";
import { GET, GETFILE } from "@/lib/services/auth";
import {
  decrypt,
  decryptFile,
  decryptString,
  encrypt,
  generateKeyPair,
  getPubKey,
  importKey,
} from "@/lib/utils";
import { getFormatedDate } from "@/utils/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  LucideDownload,
  LucideFile,
  LucideSearch,
  LucideUpload,
} from "lucide-react";
import { useEffect, useState } from "react";
import UserProfileImage from "../../components/UserProfileImage";
import { DoctorType } from "../../doctors/page";
import { useRouter } from 'next/router';

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

  const [record, setRecord] = useState<RecordDetailsType>();
  const [openPopup, setOpenPopup] = useState(true);
  const { account } = useWallet();
  const { getPatientRecord, verifyPublicKey, isDoctorExist, giveRecordAccess, getUserPublicKey } = useContract();
  const [keyPair, setKeyPair] = useState();
  const [secretPhrase, setSecretPhrase] = useState("");
  const [phraseError, setPhraseError] = useState(false);
  const [isVarified, setIsVarified] = useState(false);
  const [file, setFile] = useState<any>();
  const [doctorAddress, setDoctorAddress] = useState<string>("");
  const [doctor, setDoctor] = useState<DoctorType>();
  const router = useRouter();

  const { recordId } = router.query;
  const verifyPhrase = async () => {
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
      const record = await getPatientRecord(Number(recordId));
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

  const getDoctor = async () => {
    if (await isDoctorExist(doctorAddress)) {
      const res = await GET("/api/users/doctors", {
        doctorAddress: doctorAddress,
      });
      const doctor = res.doctors[0];
      setDoctor(doctor);
      console.log(doctor);
    }
  };

  const shareRecordToDoctor = async () => {
    if(!record)return;
    if(await isDoctorExist(doctorAddress)){
      const doctorPubKey = await getUserPublicKey(doctorAddress);
      const symetricKey = decrypt(record.accessKey, keyPair);
      const encryptedSymetricKey = encrypt(symetricKey,doctorPubKey);
      console.log(doctorPubKey);
      console.log(symetricKey);
      console.log(encryptedSymetricKey);
      const res = await giveRecordAccess(doctorAddress,record.recordId,encryptedSymetricKey);
      console.log(res)
    }
  }
  useEffect(() => {
    if (!account) return;
    setIsVarified(false);
  }, [account]);

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
            <div>
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
                    <LucideFile />
                    <span className="w-[70%] truncate">{record.fileName}</span>
                    <LucideDownload
                      className="ml-2 cursor-pointer"
                      onClick={downloadFile}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-8 border-2 p-2 gap-4">
                <div className="text-lg font-semibold">Share Record</div>
                <div className="flex flex-row w-[50%] gap-2">
                  <Input
                    className="w-[70%]"
                    value={doctorAddress}
                    placeholder="Enter Doctor Wallet Address"
                    onChange={(e) => setDoctorAddress(e.target.value)}
                  />
                  <Button onClick={getDoctor}>Search</Button>
                </div>
                {doctor && (
                  <div className="">
                    <div className="text-lg font-semibold">Doctor Details</div>
                    <div className="w-[250px] flex flex-col border-2 p-2">
                      <div className="flex gap-2 justify-start">
                        <div className="flex h-full justify-start">
                          <UserProfileImage
                            profileImage={
                              doctor?.profileImage ||
                              "https://gravatar.com/avatar/a179e37f0e7722a4ddee39e363cec952?s=200&d=robohash&r=x"
                            }
                            fallbackText={doctor?.userName}
                          />
                        </div>
                        <div className="flex flex-1 flex-col bg-card">
                          <span className="text-lg font-semibold">
                            {doctor.userName}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-3xl bg-primary text-white w-fit truncate">
                            {doctor.title}
                          </span>
                          <div className="mt-2">
                            {doctor.specialization.map((value, index) => {
                              if (index < 2) {
                                return (
                                  <span className="rounded-3xl px-2 py-1 text-xs bg-secondary text-secondary-foreground grid gap-2 w-fit truncate">
                                    {value}
                                  </span>
                                );
                              }
                            })}
                            {doctor.specialization.length > 2 &&
                              `+${doctor.specialization.length - 2}`}
                          </div>
                          <Button onClick={shareRecordToDoctor} className="mt-2">
                            Share Record
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
