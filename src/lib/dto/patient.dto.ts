export type CreatePatientDto = {
    name: string;
    phoneNumber: string;
    dob: number;
    description?: string;
    medicalRecord?: {
        recordId: string;
        date: number;
        followUpDate: number;
        treatment: string;
        notes?: string;
    }[];
};

export type EditPatientDto = {
    name: string;
    phoneNumber: string;
    dob: number;
    description?: string;
    medicalRecord?: {
        recordId: string;
        date: number;
        followUpDate: number;
        treatment: string;
        notes?: string;
    }[];
};
