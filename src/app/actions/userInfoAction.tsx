"use server"
export default async function userInfoAction(formData : FormData){
    try{
        console.log(formData)
    }
    catch(err){
        console.log(err)
    }
}