import { ExceptionModel } from "@/lib/models/ExceptionModel";
import { verifySession } from "@/lib/session";
import { RESPONSE_CODE } from "@/utils/enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const session = await verifySession();
        if(session){
            return NextResponse.json({userData: session.userData, status: RESPONSE_CODE.SUCCESS})
        }
        else{
            return NextResponse.json( {error: 'Session Expired', status: RESPONSE_CODE.SESSION_EXPIRED },{ status: RESPONSE_CODE.SERVER_ERROR })
        }
    } catch (ex) {
        if(ex instanceof ExceptionModel){
            return NextResponse.json({ error: ex.error }, { status: ex.status })
        }
        else{
            return NextResponse.json({ error: 'Server issue' }, { status: RESPONSE_CODE.SERVER_ERROR })
        }
    }
}
