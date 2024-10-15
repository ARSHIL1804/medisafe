"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContract } from "@/lib/hooks/useContract";
import { getFormatedDate } from "@/utils/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { LucideSearch, LucideUpload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type RecordType = {
  stared?: boolean;
  recordId: number;
  recordName: string;
  accessKey: string;
  fileName: string;
  fileHash: string;
  uploadedAt: string;
};
export default function MyFiles() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const { account } = useWallet();
  const { getPatientRecords } = useContract();
  const router = useRouter();
  const getRecords = async () => {
    const records:any = await getPatientRecords();
    setRecords(
      records?.map((value: any, index: number) => {
        return {
          recordId: value.record_id,
          recordName: value.record_name,
          accessKey: value.access_key,
          fileName: value.file_name,
          fileHash: value.file_hash,
          uploadedAt: value.timestamp,
        };
      })
    );
  };
  const openRecordDetails = (recordId: number)=>{
    router.push(`/dashboard/records/${recordId}`)
  }
  useEffect(() => {
    if (!account) return;
    getRecords();
  }, [account]);
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex items-center py-2 w-[60%] relative">
        <LucideSearch
          className="absolute left-2 top-7 transform -translate-y-1/2 stroke-secondary-foreground"
          size={16}
        />
        <Input
          placeholder="Search for files"
          className="pl-8 text-md border-2 border-border focus:border-secondary-foreground text-secondary-foreground"
        />
      </div>
      <div className="flex py-2 w-full flex-col justify-start items-start overflow-y-auto">
        <div className="mt-4">
          <span className="text-heading">All Records</span>
        </div>
        <div className="overflow-y-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((value, index) => {
            const record:RecordType = value;
            return (
              <div
                key={record.recordId}
                className="rounded-md flex flex-col border-2 px-4 py-2 bg-accent min-w-[250px]"
              >
                <div className="flex flex-row justify-between items-center gap-2">
                  <span className="font-semibold text-2xl">
                    {record.recordName}
                  </span>

                  <span className="text-accent-foreground text-sm">
                    {getFormatedDate(record.uploadedAt)}
                  </span>
                </div>
                <div>
                  <span className="text-xs underline cursor-pointer">
                    Shared with {0} Doctors
                  </span>
                </div>

                <div className="flex justify-end items-center mt-2">
                  <Button variant={"outline"} className="bg-primary" onClick={()=>openRecordDetails(value.recordId)}>
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
