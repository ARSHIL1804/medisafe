import dbConnect from "@/lib/db";
import { formDataToJson } from "@/lib/utils";
import { RESPONSE_CODE } from "@/utils/enum";
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import { pinata } from "@/lib/config";
export async function POST(req: NextRequest) {
  try {
    const uploadData: any = formDataToJson(await req.formData());

    await dbConnect();
    console.log(uploadData)


    const response = await pinata.upload
      .file(uploadData.file,{
        metadata:{
         keyValues:{
          'name': uploadData.name,
          'description':uploadData.description,
          'iv':uploadData.iv
        }
      }
    })
    console.log(response);

    return NextResponse.json({ hash:response.IpfsHash }, { status: RESPONSE_CODE.SUCCESS })

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Server issue' }, { status: RESPONSE_CODE.SERVER_ERROR })
  }
}

export async function GET(req: NextRequest, res: NextResponse) {

  const { searchParams } = new URL(req.url);
  const cid = searchParams.get('cid');
  console.log(cid as string)
  try {
    
    const response = await pinata.gateways.get(cid as string);
      
    console.log(response);
    const blob = response.data as Blob
    console.log(blob)
    const arrayBuffer = await blob.arrayBuffer();

    const metadata = await getFileMetaData(cid as string);
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream', 
        'Content-Disposition': 'attachment; filename="example.bin"', 
        'Content-Length': arrayBuffer.byteLength.toString(),
        'X-Pinata-Metadata': JSON.stringify(metadata)
      }
    });

  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: 'Server issue' }, { status: RESPONSE_CODE.SERVER_ERROR })
  }
}


async function getFileMetaData(cid:string) { 
  const url = `https://api.pinata.cloud/data/pinList?status=pinned&ipfs_pin_hash=${cid}`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'NEXT_PINATA_API_KEY': process.env.NEXT_PINATA_API_KEY || '',
              'pinata_secret_api_key': process.env.NEXT_PINATA_API_SECRET || ''
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.rows && data.rows.length > 0) {
          return data.rows[0].metadata.keyvalues 
      } else {
        return null;
      }
  } catch (error) {
      console.log(error)
      throw error;
  }
}