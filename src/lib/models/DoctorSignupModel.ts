import { DOCTOR_SPECIALIZATION, USER_GENDER, USER_TYPE } from '@/utils/enum';
import { z } from 'zod';

export const DoctorSignupSchema = z.object({
    username: z
      .string()
      .min(4, "User name is too short")
      .regex(
        RegExp("^[a-zA-Z][a-zA-Z 0-9_\s]*$"),
        "Name should starts with alphabets only contain A-Z,a-z,0-9,_"
    ),
    usertype: z.enum([USER_TYPE.DOCTOR]),
    title:z.string(),
    specialization:z.array(z.enum([DOCTOR_SPECIALIZATION.GeneralPractitioner, DOCTOR_SPECIALIZATION.Dermatologist, DOCTOR_SPECIALIZATION.Psychiatrist, DOCTOR_SPECIALIZATION.Dentist, DOCTOR_SPECIALIZATION.Nutritionist, DOCTOR_SPECIALIZATION.Psychologist, DOCTOR_SPECIALIZATION.Physiotherapist, DOCTOR_SPECIALIZATION.Sexologist, DOCTOR_SPECIALIZATION.SleepSpecialist, DOCTOR_SPECIALIZATION.AddictionSpecialist, DOCTOR_SPECIALIZATION.AllergySpecialist, DOCTOR_SPECIALIZATION.ChildPsychologist, DOCTOR_SPECIALIZATION.Geriatrician, DOCTOR_SPECIALIZATION.Podiatrist])),
    gender: z.enum([USER_GENDER.MALE,USER_GENDER.FEMALE,USER_GENDER.NOT_SPECFIFIED]),
    phone:z.string(),
    email:z.string().email(),
    dob:z.date(),
    profileImage: z.instanceof(File),
    address:z.string().max(128),
    workDescription: z.string().max(512),
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
    }),
})
export type DoctorSignupModel = z.infer<typeof DoctorSignupSchema>;