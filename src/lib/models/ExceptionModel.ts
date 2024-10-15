import { RESPONSE_CODE } from "@/utils/enum";

export class ExceptionModel{
    error: string = '';
    status: number = -1;

    constructor(error:string,status:number){
        this.error = error;
        this.status = status;
    }
}