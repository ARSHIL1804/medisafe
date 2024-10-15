import dbConnect from "@/lib/db";
import User from "@/lib/models/UserSchema";
import { createSession, deleteSession } from "@/lib/session";
import { verifySignature } from "@/lib/verifySign";
import { RESPONSE_CODE } from "@/utils/enum";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){

    try {
        deleteSession();
        return NextResponse.json({ message: 'Logout Successfully' }, { status: RESPONSE_CODE.SUCCESS })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Server issue' }, { status: RESPONSE_CODE.SERVER_ERROR })
    }
}