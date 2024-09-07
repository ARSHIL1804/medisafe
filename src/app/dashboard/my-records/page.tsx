"use client"
import { RecordsList } from "@/components/RecordsList";
import { Input } from "@/components/ui/input";
import { LucideSearch, LucideUpload } from "lucide-react";
import {useState} from 'react';
export default function MyFiles() {

  const [openPopup, setOpenPopup] = useState(false);

  return (
    <div className="w-full">
      <div className="w-full py-3">
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
      </div>
      <div className="flex py-2 w-full flex-col justify-start items-start">
        <div className="flex flex-col justify-start rounded-md py-3 pl-3 pr-10 bg-primary cursor-pointer" onClick={()=>setOpenPopup(true)}>
          <LucideUpload size={16} className="text-primary-foreground" />
          <span className="mt-2 text-sm font-semibold text-primary-foreground">
            Upload File
          </span>
        </div>
        <div className="mt-8">
           <span className="text-heading">All Records</span>
        </div>
        <RecordsList openPopup={openPopup} setOpenPopup={setOpenPopup}/>
      </div>
    </div>
  );
}
