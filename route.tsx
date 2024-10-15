import { NextRequest, NextResponse } from "next/server";
import user from "@/lib/models/PatientSchema";
import { formSchema } from "@/utils/utils";


export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        data['dob'] = new Date(data['dob'])
        await user.find({})
        formSchema.parse(data);
        return new NextResponse()
    } catch (error) {
        console.log(error);
    }
}