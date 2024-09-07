import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifySession } from "./lib/session";


const protectedRoutes = ["dashboard"];

export default async function middleware(req: NextRequest,res:NextResponse) {
    const sessionRes = await verifySession();

    const url = req.nextUrl.pathname.split('/')[1];
    console.log('url : ' , url, sessionRes)
    if(!sessionRes && protectedRoutes.includes(url)){
      const absoluteURL = new URL("/", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}