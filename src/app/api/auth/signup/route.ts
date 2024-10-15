import { PatientSignupSchema } from "@/lib/models/PatientSignupModel";
import Patient from "@/lib/models/PatientSchema";
import Doctor from "@/lib/models/DoctorSchema";
import User from "@/lib/models/UserSchema";
import { createSession } from "@/lib/session";
import { verifySignature } from "@/lib/verifySign";
import { RESPONSE_CODE, USER_TYPE, WALLET } from "@/utils/enum";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { uploadFile } from "@/lib/cloudinary";
import { formDataToJson } from "@/lib/utils";
import mongoose from "mongoose";
import { DoctorSignupSchema } from "@/lib/models/DoctorSignupModel";
import { ExceptionModel } from "@/lib/models/ExceptionModel";
import { UploadApiResponse } from "cloudinary";



export async function POST(req: NextRequest) {
  try {
    console.log('here')

    const requestData:any = formDataToJson(await req.formData());
    await dbConnect()
    const userData = { ...requestData, dob: new Date(requestData.dob) }
    userData.signMessage = JSON.parse(userData.signMessage);
    console.log(userData)
    const result = verifySignature(userData?.signMessage?.fullMessage, userData?.signMessage?.signature, userData?.publicKey)
    console.log(result);
    if (!result) {
      return NextResponse.json({ error: 'Request Failed due to invalid data.' }, { status: RESPONSE_CODE.INVALID_INPUT })
    }


    const userResult = await User.findOne({ walletAddress: userData.signMessage.address });
    if (userResult) {
      return NextResponse.json({ error: 'Account address already associated with another account.' }, { status: RESPONSE_CODE.ACCOUNT_ALREADY_EXISTS })
    }

    let userDbData;
    if (userData.usertype === USER_TYPE.PATIENT) {
      userDbData = await signupPatient(userData);
    }
    else if(userData.usertype === USER_TYPE.DOCTOR) {
      userDbData = await signupDoctor(userData);
    }
    await createSession(userDbData);
    return NextResponse.json({ userData: userDbData }, { status: RESPONSE_CODE.SUCCESS })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Server issue' }, { status: RESPONSE_CODE.SERVER_ERROR })
  }
}


const signupPatient = async (userData: any) => {
  const session = await mongoose.startSession();
  console.log('USER DATA' , userData)

  try{
    const parseData = PatientSignupSchema.safeParse({ ...userData, dob: new Date(userData.dob) });
    if (!parseData.success) {
      return NextResponse.json({ error: 'Request Failed due to invalid data.' }, { status: RESPONSE_CODE.INVALID_INPUT })
    }

    const imgBuffer = new Uint8Array(await userData.profileImage.arrayBuffer())
    const uploadRes:any = await uploadFile(imgBuffer);
    const patientInstance = new Patient({
      username: userData.username,
      usertype: userData.usertype,
      gender: userData.gender,
      phone: userData.phone,
      email: userData.email,
      dob: userData.dob,
      profileImage: uploadRes.url ?? undefined,
      address: userData.address,
      walletAddress: userData.signMessage.address,
    });
  
    const userInstance = new User({
      username: userData.username,
      usertype: userData.usertype,
      walletAddress: userData.signMessage.address,
      profileImage: uploadRes.url,
    });
  
    session.startTransaction();
    await patientInstance.save();
    await userInstance.save();
    await session.commitTransaction(); 
    session.endSession();
    return {
      username: userData.username,
      usertype: userData.usertype,
      walletAddress: userData.signMessage.address,
      profileImage: uploadRes?.url,
    }
  }  
  catch(err){
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}


const signupDoctor = async (userData: any) => {
  const session = await mongoose.startSession();
  console.log('doctor')
  try{
    userData.specialization = JSON.parse(userData.specialization)
    const parseData = DoctorSignupSchema.safeParse({ ...userData, dob: new Date(userData.dob) });
    if (!parseData.success) {
      throw new ExceptionModel('Request Failed due to invalid data.',RESPONSE_CODE.INVALID_INPUT);
    }
  
    const imgBuffer = new Uint8Array(await userData.profileImage.arrayBuffer())
    const uploadRes:any = await uploadFile(imgBuffer);

    console.log({
      username: userData.username,
      usertype: userData.usertype,
      title: userData.title,
      specialization: userData.specialization,
      gender: userData.gender,
      phone: userData.phone,
      email: userData.email,
      dob: userData.dob,
      profileImage: uploadRes.url,
      address: userData.address,
      workDescription: userData.workDescription,
      walletAddress: userData.signMessage.address,
    });
    const doctorInstance = new Doctor({
      username: userData.username,
      usertype: userData.usertype,
      title: userData.title,
      specialization: userData.specialization,
      gender: userData.gender,
      phone: userData.phone,
      email: userData.email,
      dob: userData.dob,
      profileImage: uploadRes.url,
      address: userData.address,
      workDescription: userData.workDescription,
      walletAddress: userData.signMessage.address,
    });
  
    const userInstance = new User({
      username: userData.username,
      usertype: userData.usertype,
      walletAddress: userData.signMessage.address,
      profileImage: uploadRes.url,

    });

    console.log(doctorInstance);
  
    console.log(userInstance)
    session.startTransaction();
    await doctorInstance.save();
    await userInstance.save();
    await session.commitTransaction(); 
    session.endSession();
    return {
      username: userData.username,
      usertype: userData.usertype,
      walletAddress: userData.signMessage.address,
      profileImage: uploadRes.url,
    }
  }  
  catch(err){
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}