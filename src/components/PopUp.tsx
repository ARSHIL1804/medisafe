import { LucideCross } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "./ui/dialog";
import React from 'react'
import { Close, DialogClose } from "@radix-ui/react-dialog";

export default function PopUp({ title, children, openPopup, setOpenPopup }:any) {

  console.log({ title, children, openPopup, setOpenPopup })
  return ( 
    <Dialog  open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent>
          <DialogHeader>
            <div style={{ display: 'flex' }}>
                <span>
                    {title}
                </span>
            </div>
          </DialogHeader>
          {children}
        </DialogContent>
    </Dialog>
  )
}
