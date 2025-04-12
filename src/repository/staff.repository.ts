import {
    FilterQuery,
    PopulateOptions,
    ProjectionType,
    QueryOptions,
    Types,
    UpdateQuery,
} from "mongoose";
import StaffModel, { StaffDocument } from "../entity/staff.model";
import { DoctorModel } from "../entity/staff.model";
import { NurseModel } from "../entity/staff.model";
import { CreateStaffDto } from "../lib/dto/staff.dto";

const StaffRepository = {
    create: async function create(dto: CreateStaffDto): Promise<StaffDocument> {
        const schedule = {
            scheduleStartTime: dto.scheduleStartTime,
            scheduleEndTime: dto.scheduleEndTime,
            workDays: dto.workDays,
            scheduleWorkDescription: dto.scheduleWorkDescription,
        };

        if (dto.role === "Doctor") {
            return await DoctorModel.create({
                name: dto.name,
                phoneNumber: dto.phoneNumber,
                dob: dto.dob,
                description: dto.description,
                schedule,
                specialization: dto.specialization,
            });
        } else if (dto.role === "Nurse") {
            return await NurseModel.create({
                name: dto.name,
                phoneNumber: dto.phoneNumber,
                dob: dto.dob,
                description: dto.description,
                schedule,
                specialization: dto.specialization,
            });
        } else {
            return await StaffModel.create({
                name: dto.name,
                phoneNumber: dto.phoneNumber,
                dob: dto.dob,
                description: dto.description,
                schedule,
            });
        }
    },

    editOne: async function editOne(
        staffId: Types.ObjectId,
        update: UpdateQuery<StaffDocument>,
        options: QueryOptions<StaffDocument> = {}
    ): Promise<StaffDocument | null> {
        return await StaffModel.findOneAndUpdate(
            { _id: staffId, deletedAt: { $exists: false } },
            { ...update },
            { ...options, new: true }
        );
    },

    getOne: async function getOne(
        query: FilterQuery<StaffDocument>,
        projection: ProjectionType<StaffDocument> = {},
        options: QueryOptions<StaffDocument> = {}
    ): Promise<StaffDocument | null> {
        return await StaffModel.findOne(
            { ...query, deletedAt: { $exists: false } },
            projection,
            { ...options, sort: { createdAt: -1 } }
        );
    },

    getById: async function getById(
        id: Types.ObjectId,
        projection: ProjectionType<StaffDocument> = {},
        options: QueryOptions<StaffDocument> = {}
    ): Promise<StaffDocument | null> {
        return await this.getOne({ _id: id }, projection, options);
    },

    get: async function get(
        query: FilterQuery<StaffDocument>,
        projection: ProjectionType<StaffDocument>,
        options: QueryOptions<StaffDocument>
    ): Promise<StaffDocument[]> {
        return await StaffModel.find(
            { ...query, deletedAt: { $exists: false } },
            projection,
            { ...options, sort: { createdAt: -1 } }
        );
    },

    getPaginated: async function getPaginated(
        query: FilterQuery<StaffDocument>,
        projection: ProjectionType<StaffDocument>,
        populateOptions: PopulateOptions | (string | PopulateOptions)[],
        pageSize: number,
        pageNumber: number
    ): Promise<[number, StaffDocument[]]> {
        return await Promise.all([
            StaffModel.countDocuments({
                ...query,
                deletedAt: { $exists: false },
            }),
            StaffModel.find(
                { ...query, deletedAt: { $exists: false } },
                projection,
                { sort: { createdAt: -1 } }
            )
                .skip(Math.max(pageSize * (pageNumber - 1), 0))
                .limit(pageSize)
                .populate(populateOptions),
        ]);
    },

    markAsDeleted: async function markAsDeleted(
        staffId: Types.ObjectId,
        options: QueryOptions<StaffDocument> = {}
    ): Promise<StaffDocument | null> {
        return await StaffModel.findOneAndUpdate(
            { _id: staffId, deletedAt: { $exists: false } },
            { deletedAt: Date.now() },
            { ...options, new: true }
        );
    },

    deleteOne: async function deleteOne(
        staffId: Types.ObjectId,
        options: QueryOptions<StaffDocument> = {}
    ): Promise<StaffDocument | null> {
        return await StaffModel.findOneAndDelete({ _id: staffId }, options);
    },
};

export default StaffRepository;
