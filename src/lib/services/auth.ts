import { RESPONSE_CODE } from "@/utils/enum";
import { ShowAlertEvent } from "@/utils/events";
import { AwardIcon } from "lucide-react";

export async function GET(api: string, params: Record<string, string> = {}, showError:boolean=true) {
    document.dispatchEvent(new Event("openOverlay"));

    let query = ''
    if (params) {
        query = new URLSearchParams(params).toString();
    }
    api = api + (query ? `?${query}` : '');
    const res = await fetch(api, {
        method: 'GET'
    });
    document.dispatchEvent(new Event("closeOverlay"));

    if(res.status == RESPONSE_CODE.SUCCESS){
        const resData = await res.json();
        return resData;  
    }
    else if(showError){
        let resData = await res.json();
        let errorEvent = new ShowAlertEvent(resData.error);
        document.dispatchEvent(errorEvent.event);
        throw 'Error';
    }
    throw 'Error';
}

export async function GETFILE(api: string, params: Record<string, string> = {}, showError:boolean=true) {
    document.dispatchEvent(new Event("openOverlay"));

    let query = ''
    if (params) {
        query = new URLSearchParams(params).toString();
    }
    api = api + (query ? `?${query}` : '');
    const res = await fetch(api, {
        method: 'GET'
    });
    document.dispatchEvent(new Event("closeOverlay"));

    if(res.status == RESPONSE_CODE.SUCCESS){
       return res;
    }
    else if(showError){
        let errorEvent = new ShowAlertEvent('Server Issue');
        document.dispatchEvent(errorEvent.event);
        throw 'Error';
    }
    throw 'Error';
}

export async function POST(api: string, data:any, showError:boolean = true, stringify:boolean = true) {

    document.dispatchEvent(new Event("openOverlay"));
    const res = await fetch(api, {
        method: 'POST',
        body: stringify ? JSON.stringify(data): data,
    });
    document.dispatchEvent(new Event("closeOverlay"));
    if(res.status == RESPONSE_CODE.SUCCESS){
        const resData = await res.json();
        return resData;
    }
    else if(showError){
        let resData = await res.json();
        let errorEvent = new ShowAlertEvent(resData.error);
        document.dispatchEvent(errorEvent.event);
    }
    throw res;
}
