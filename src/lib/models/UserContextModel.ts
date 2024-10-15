import { DOCTOR_SPECIALIZATION, USER_TYPE } from "@/utils/enum";

export default interface  UserContextModel{
    walletAddress: string,
    username: string,
    usertype: USER_TYPE.DOCTOR,
    profileImage : string
}