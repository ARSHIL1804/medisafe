import { NextRequest, NextResponse } from "next/server";
import Doctor from "@/lib/models/DoctorSchema";
import { RESPONSE_CODE } from "@/utils/enum";
export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const { searchParams } = new URL(req.url);
        const doctorAddress = searchParams.get('doctorAddress');
        let doctors;
        if(doctorAddress){
          doctors = await Doctor.find({'walletAddress': doctorAddress});
        }
        else{
            doctors = await Doctor.find();
        }
        return NextResponse.json({doctors:doctors}, {status: RESPONSE_CODE.SUCCESS})

    } catch (error: any) {
       return NextResponse.json({error:'Server Issue'},{status:RESPONSE_CODE.SERVER_ERROR});
    }
  }