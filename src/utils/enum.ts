export enum USER_TYPE {
    DOCTOR = "Doctor",
    PATIENT = "Patient"
}

export enum USER_GENDER {
    MALE = "Male",
    FEMALE = "Female",
    NOT_SPECFIFIED = "Not want to specify"
}

export enum WALLET { 
    GOOGLE = "GOOGLE",
    PETRA = "PETRA",
    NIGHTLY = "NIGHTLY",
    PONTEM = "PONTEM" 
}

export enum  DOCTOR_SPECIALIZATION {
    GeneralPractitioner = 'General Practitioner',
    Dermatologist = 'Dermatologist',
    Psychiatrist = 'Psychiatrist',
    Dentist = 'Dentist',
    Nutritionist = 'Nutritionist',
    Psychologist = 'Psychologist',
    Physiotherapist = 'Physiotherapist',
    Sexologist = 'Sexologist',
    SleepSpecialist = 'Sleep Specialist',
    AddictionSpecialist = 'Addiction Specialist',
    AllergySpecialist = 'Allergy Specialist',
    ChildPsychologist = 'Child Psychologist',
    Geriatrician = 'Geriatrician',
    Podiatrist = 'Podiatrist'
}

export enum RESPONSE_CODE{
    SUCCESS = 200,
    SERVER_ERROR = 500,
    INVALID_INPUT = 501,
    ACCOUNT_ALREADY_EXISTS=502,
    ACCOUNT_NOT_FOUND = 503,
    SESSION_EXPIRED = 504,
}



DOCTOR_SPECIALIZATION.GeneralPractitioner,DOCTOR_SPECIALIZATION.Dermatologist,DOCTOR_SPECIALIZATION.Psychiatrist,DOCTOR_SPECIALIZATION.Dentist,DOCTOR_SPECIALIZATION.Nutritionist,DOCTOR_SPECIALIZATION.Psychologist,DOCTOR_SPECIALIZATION.Physiotherapist,DOCTOR_SPECIALIZATION.Sexologist,DOCTOR_SPECIALIZATION.SleepSpecialist,DOCTOR_SPECIALIZATION.AddictionSpecialist,DOCTOR_SPECIALIZATION.AllergySpecialist,DOCTOR_SPECIALIZATION.ChildPsychologist,DOCTOR_SPECIALIZATION.Geriatrician,DOCTOR_SPECIALIZATION.Podiatrist