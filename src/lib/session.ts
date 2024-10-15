import 'server-only'
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import UserContextModel from './models/UserContextModel'

const key = new TextEncoder().encode(process.env.NEXT_JWT_TOKEN)

const cookie = {
    name: 'session',
    duration: 24 * 60 * 60 * 1000,
}
const cookieOption: {
    httpOnly: boolean,
    secure: boolean,
    sameSite: 'lax',
    path: string,
} = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
}



const encrypt = async (payload:any) =>  {
    return await new SignJWT(payload)
    .setProtectedHeader({'alg':'HS256'})
    .setIssuedAt()
    .setExpirationTime('1day')
    .sign(key)
}


const decrypt = async (session:any) => {
    try{
        const {payload} = await jwtVerify(session,key,{
            algorithms: ['HS256']
        })
        return payload;
    }
    catch(err){
        return null;
    }
}


export async function  createSession(userData:any) {
    try {
        const expires = new Date(Date.now() + cookie.duration);
        const session = await encrypt({userData,expires});
        cookies().set(cookie.name,session,{...cookieOption,expires});
        return true;   
    } catch (error) {
        console.log(error)
        return false;
    }    
}

export async function verifySession (){
    const sessionCookie = cookies().get(cookie?.name)?.value;
    const session = await decrypt(sessionCookie);
    if(!session){
        return null;
    }
    else{
        return session;
    }
}

export async function deleteSession (){
    cookies().delete(cookie?.name);
    return true;
}