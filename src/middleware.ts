import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifySession } from "./lib/session";
import { USER_TYPE } from "./utils/enum";


const protectedRoutes = ["dashboard"];

const doctorRestrictedRoutes = ["records",]

export default async function middleware(req: NextRequest,res:NextResponse) {
    const sessionRes:any = await verifySession();

    const url = req.nextUrl.pathname.split('/')[1];
    if(!sessionRes && protectedRoutes.includes(url)){
      const absoluteURL = new URL("/", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
    console.log(req.nextUrl.pathname,sessionRes)
    if(sessionRes && sessionRes.userData){
      const subroute = req.nextUrl.pathname.split('/')[2];
      const absoluteURL = new URL("/dashboard/shared-records", req.nextUrl.origin);

      if(sessionRes.userData?.usertype === USER_TYPE.DOCTOR && doctorRestrictedRoutes.includes(subroute)){
        const absoluteURL = new URL("/dashboard/shared-records", req.nextUrl.origin);
        console.log(absoluteURL, sessionRes.userData?.usertype,sessionRes.userData?.usertype === USER_TYPE.DOCTOR,subroute,doctorRestrictedRoutes.includes(subroute))

        return NextResponse.redirect(absoluteURL.toString());
      }
    }
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}