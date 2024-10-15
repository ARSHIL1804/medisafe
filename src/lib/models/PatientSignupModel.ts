import { USER_GENDER, USER_TYPE } from '@/utils/enum';
import { z } from 'zod';

export const PatientSignupSchema = z.object({
    username: z
      .string()
      .min(4, "User name is too short")
      .regex(
        RegExp("^[a-zA-Z][a-zA-Z 0-9_\s]*$"),
        "Name should starts with alphabets only contain A-Z,a-z,0-9,_"
    ),
    usertype: z.enum([USER_TYPE.PATIENT]),
    gender: z.enum([USER_GENDER.MALE,USER_GENDER.FEMALE,USER_GENDER.NOT_SPECFIFIED]),
    phone:z.string(),
    email:z.string().email(),
    dob:z.date(),
    profileImage: z.instanceof(File),
    address:z.string().max(128),
    walletAddress:z.string(),
    publicKey:z.string(),
    encryptionPublicKey:z.string(),
    signMessage: z.object({
        address: z.string(),
        application:z.string(),
        chainId:z.number(),
        message: z.string(),
        nonce: z.string(),
        fullMessage: z.string(),
        prefix: z.string(),
        signature: z.string()
    })
})
export type PatientSignupModel = z.infer<typeof PatientSignupSchema>;