import { USER_GENDER, USER_TYPE } from '@/utils/enum'
import mongoose from 'mongoose'


const Patient = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    usertype: {
        type: String,
        enum: USER_TYPE,
        required:true
    },
    gender: {
        type: String,
        enum: USER_GENDER,
        required:true
    },
    phone: { 
        type: String,
        required:true
    },
    email: { 
        type: String,
        required:true
    },
    dob: {
        type: Date,
        required:true
    },
    profileImage: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
        required:true
    },
})

export default mongoose.models.Patient || mongoose.model("Patient", Patient);