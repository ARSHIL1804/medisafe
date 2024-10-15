import { DOCTOR_SPECIALIZATION, USER_GENDER, USER_TYPE } from '@/utils/enum'
import mongoose from 'mongoose'


const Doctor = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    usertype: {
        type: String,
        enum: USER_TYPE,
        required:true
    },
    title: {
        type: String,
        required:true
    },
    specialization: {
        type: [String],
        enum: DOCTOR_SPECIALIZATION,
        required: true,
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
    workDescription: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required:true
    },
})

export default mongoose.models.Doctor || mongoose.model("Doctor", Doctor);