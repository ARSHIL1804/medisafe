import { RESPONSE_CODE } from '@/utils/enum';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, res: NextResponse) {


    const { searchParams } = new URL(req.url);
    const cid = searchParams.get('cid');
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
            return NextResponse.json({ data: data.rows[0].metadata.keyvalues }, { status: RESPONSE_CODE.SUCCESS } )
        } else {
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'SERVER ISSUE' }, { status: RESPONSE_CODE.SERVER_ERROR } )
    }
}