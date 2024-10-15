"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  RESPONSE_CODE,
  USER_GENDER,
  USER_TYPE,
} from "@/utils/enum";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { generateNonce } from "@/lib/utils";
import {
  PatientSignupModel,
  PatientSignupSchema,
} from "@/lib/models/PatientSignupModel";
import { useAuth } from "@/app/providers/AuthProvider";
import {} from "@/app/providers/OverlayProvider";
import { useAlert } from "@/app/providers/AlertProvider";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useContract } from "@/lib/hooks/useContract";


export default function PatientForm({setIsPatientSigUp,handleSubmit} : {setIsPatientSigUp:any,handleSubmit:any}) {
  
  const form = useForm<PatientSignupModel>({
    resolver: zodResolver(PatientSignupSchema),
    defaultValues: {
      username: "",
      usertype: USER_TYPE.PATIENT,
      gender: USER_GENDER.MALE,
      phone: "",
      email: "",
      address: "",
      walletAddress: "",
      publicKey: "",
      encryptionPublicKey: "",
      signMessage: {
        address: "",
        application: "",
        chainId: 2,
        message: "Sign in with Medisafe",
        nonce: "",
        fullMessage: "",
        prefix: "APTOS",
        signature: "",
      },
    },
  });
  return (
    <div className="w-full mt-2">
      <div className="text-2xl font-semibold">
        Signup as Patient
      </div>
      <Form {...form}>
        <form
          className="space-y-4 mt-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select  {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value={USER_GENDER.MALE}>
                            {USER_GENDER.MALE}
                          </SelectItem>
                          <SelectItem value={USER_GENDER.FEMALE}>
                            {USER_GENDER.FEMALE}
                          </SelectItem>
                          <SelectItem value={USER_GENDER.NOT_SPECFIFIED}>
                            {USER_GENDER.NOT_SPECFIFIED}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phnoe No.</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 00000 00000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="abc@xyz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex-1 ">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger className="flex" asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Date Of Birth</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: any) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => {
                return (
                  <FormItem className="flex-1">
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          field.onChange(
                            e?.target?.files ? e?.target?.files[0] : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mumbai, Maharastra, India"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm underline cursor-pointer" onClick={()=>setIsPatientSigUp(false)}>Signup as Doctor</p>
          <Button type="submit" className='px-4 py-2 text-white bg-primary rounded hover:bg-primary' onClick={(e)=>handleSubmit(e,form)}>
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}
