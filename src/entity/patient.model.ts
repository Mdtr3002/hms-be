import mongoose, { Document, Schema } from "mongoose";

type MedicalRecord = {
    recordId: string;
    date: number;
    followUpDate: number;
    treatment: string;
    notes?: string;
};

export type PatientDocument = Document & {
    name: string;
    phoneNumber: string;
    dob: number;
    description?: string;
    medicalRecord?: MedicalRecord[];
};

const patientSchema = new Schema<PatientDocument>({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: Number, required: true },
    description: { type: String, required: false },
    medicalRecord: [
        {
            recordId: { type: String, required: true },
            date: { type: Number, required: true },
            followUpDate: { type: Number, required: true },
            treatment: { type: String, required: true },
            notes: { type: String, required: false },
        },
    ],
});

const PatientModel = mongoose.model<PatientDocument>("patients", patientSchema);
export default PatientModel;
