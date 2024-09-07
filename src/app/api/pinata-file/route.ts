import dbConnect from "@/lib/db";
import { formDataToJson } from "@/lib/utils";
import { RESPONSE_CODE } from "@/utils/enum";
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
export async function POST(req: NextRequest) {
    try {  
      const uploadData:any = await req.formData();
      await dbConnect();
      console.log(uploadData)
      const response = await axios.post(`https://api.pinata.cloud/pinning/pinFileToIPFS`, uploadData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${uploadData._boundary}`,
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Server issue' }, { status: RESPONSE_CODE.SERVER_ERROR })
    }
}

export async function GET(req: NextRequest) {
    const { cid } = req.params;

    try {
      // Fetch file metadata from Pinata
      const response = await axios.get(`https://api.pinata.cloud/pinning/pinList?status=pinned&hashContains=${cid}`, {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`
        }
      });
  
      // Check if the file was found
      if (response.data.count === 0) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      const fileData = response.data.rows[0];
  
      // Construct the IPFS gateway URL
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${fileData.ipfs_pin_hash}`;
  
      // Return file information
      res.json({
        name: fileData.metadata.name,
        cid: fileData.ipfs_pin_hash,
        size: fileData.size,
        created: fileData.date_pinned,
        gatewayUrl
      });
  
    } catch (error) {
      console.error('Error fetching file from Pinata:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to retrieve file information' });
    }
}