import mongoose, { Schema, Document } from "mongoose";

type Schedule = {
    scheduleStartTime: string;
    scheduleEndTime: string;
    workDays: string[];
    scheduleWorkDescription: string;
};

type Staff = {
    name: string;
    phoneNumber: string;
    dob: number;
    description?: string;
    schedule: Schedule;
};

export type StaffDocument = Document & Staff;

const staffSchema = new Schema<StaffDocument>(
{
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: Number, required: true },
    description: { type: String },
    schedule: {
    scheduleStartTime: { type: String, required: true },
    scheduleEndTime: { type: String, required: true },
    workDays: { type: [String], required: true },
    scheduleWorkDescription: { type: String, required: true },
},
},
    {
    discriminatorKey: "role",
    collection: "staffs", 
}
);

const StaffModel = mongoose.model<StaffDocument>("staffs", staffSchema);
export default StaffModel;

type Doctor = Staff & {
    specialization: string;
};

export type DoctorDocument = StaffDocument & Doctor;

const doctorSchema = new Schema<DoctorDocument>({
    specialization: { type: String, required: true },
});

export const DoctorModel = StaffModel.discriminator<DoctorDocument>(
    "Doctor",
    doctorSchema
);


type Nurse = Staff & {  
    specialization: string;
};

export type NurseDocument = StaffDocument & Nurse;

const nurseSchema = new Schema<NurseDocument>({
    specialization: { type: String, required: true },
});

export const NurseModel = StaffModel.discriminator<NurseDocument>(
    "Nurse",
    nurseSchema
);
