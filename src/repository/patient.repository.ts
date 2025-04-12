import {
    FilterQuery,
    PopulateOptions,
    ProjectionType,
    QueryOptions,
    Types,
    UpdateQuery,
} from "mongoose";
import PatientModel, { PatientDocument } from "../entity/patient.model";
import { CreatePatientDto } from "../lib/dto/patient.dto";

const PatientRepository = {
    create: async function create(dto: CreatePatientDto) {
        return await PatientModel.create({
            ...dto,
        });
    },

    editOne: async function editOne(
        eventId: Types.ObjectId,
        update: UpdateQuery<PatientDocument>,
        options: QueryOptions<PatientDocument> = {}
    ) {
        return await PatientModel.findOneAndUpdate(
            { _id: eventId, deletedAt: { $exists: false } },
            { ...update },
            { ...options, new: true }
        );
    },

    getOne: async function getOne(
        query: FilterQuery<PatientDocument>,
        projection: ProjectionType<PatientDocument> = {},
        options: QueryOptions<PatientDocument> = {}
    ): Promise<PatientDocument> {
        return await PatientModel.findOne(
            { ...query, deletedAt: { $exists: false } },
            projection,
            { ...options, sort: { startedAt: -1 } }
        );
    },

    getById: async function getById(
        id: Types.ObjectId,
        projection: ProjectionType<PatientDocument> = {},
        options: QueryOptions<PatientDocument> = {}
    ): Promise<PatientDocument> {
        return await this.getOne({ _id: id }, projection, options);
    },

    get: async function get(
        query: FilterQuery<PatientDocument>,
        projection: ProjectionType<PatientDocument>,
        options: QueryOptions<PatientDocument>
    ) {
        return await PatientModel.find(
            { ...query, deletedAt: { $exists: false } },
            projection,
            { ...options, sort: { startedAt: -1 } }
        );
    },

    getPaginated: async function getPaginated(
        query: FilterQuery<PatientDocument>,
        projection: ProjectionType<PatientDocument>,
        populateOptions: PopulateOptions | (string | PopulateOptions)[],
        pageSize: number,
        pageNumber: number
    ) {
        return await Promise.all([
            PatientModel.count({
                ...query,
                deletedAt: { $exists: false },
            }),
            PatientModel.find(
                {
                    ...query,
                    deletedAt: { $exists: false },
                },
                projection,
                { sort: { startedAt: -1 } }
            )
                .skip(Math.max(pageSize * (pageNumber - 1), 0))
                .limit(pageSize)
                .populate(populateOptions),
        ]);
    },

    markAsDeleted: async function markAsDeleted(
        eventId: Types.ObjectId,
        options: QueryOptions<PatientDocument> = {}
    ) {
        return await PatientModel.findOneAndUpdate(
            { _id: eventId, deletedAt: { $exists: false } },
            { deletedAt: Date.now() },
            { ...options, new: true }
        );
    },

    deleteOne: async function deleteOne(
        eventId: Types.ObjectId,
        options: QueryOptions<PatientDocument> = {}
    ) {
        return await PatientModel.findOneAndDelete({ _id: eventId }, options);
    },
};

export default PatientRepository;
