import { USER_TYPE } from '@/utils/enum'
import mongoose from 'mongoose'


const User = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    usertype: {
        type: String,
        enum: USER_TYPE,
        required:true
    },
    profileImage: {
        type: String,
        required:true
    },
    walletAddress: {
        type: String,
        required:true
    },
})

export default mongoose.models.User || mongoose.model("User", User);