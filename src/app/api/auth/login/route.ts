import dbConnect from "@/lib/db";
import User from "@/lib/models/UserSchema";
import { createSession } from "@/lib/session";
import { verifySignature } from "@/lib/verifySign";
import { RESPONSE_CODE } from "@/utils/enum";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){

    try {
        const {walletAddress,signMessage,publicKey} = await req.json();
        const result = verifySignature(signMessage.fullMessage,signMessage.signature,publicKey)
        if(!result){
            return NextResponse.json({ error: 'Request Failed due to invalid data.' }, { status: RESPONSE_CODE.INVALID_INPUT })
        }
        console.log(walletAddress)
        
        if(walletAddress) {
            await dbConnect()
            const userRes = await User.findOne({'walletAddress': walletAddress});
            console.log(userRes);
            if(userRes){
                await createSession(userRes);
                return NextResponse.json({ isUserDetailsExist: true, userData: userRes }, { status: RESPONSE_CODE.SUCCESS })
            }
            else{
                return NextResponse.json({ error:"User with this address doest not exists" }, { status: RESPONSE_CODE.ACCOUNT_NOT_FOUND })
            }
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Server issue' }, { status: RESPONSE_CODE.SERVER_ERROR })
    }
}