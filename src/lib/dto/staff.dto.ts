export interface CreateStaffDto {
    name: string;
    phoneNumber: string;
    dob: number;
    description?: string;
    scheduleStartTime: string;
    scheduleEndTime: string;
    workDays: string[];
    scheduleWorkDescription: string;
    specialization: string;
    role: "Doctor" | "Nurse"; 
}