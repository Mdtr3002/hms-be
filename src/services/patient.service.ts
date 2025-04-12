import { injectable } from "inversify";
import { logger } from "../lib/logger";
import { FilterQuery, Types } from "mongoose";
import { CreatePatientDto, EditPatientDto } from "../lib/dto/patient.dto";
import PatientRepository from "../repository/patient.repository";
import { Request, Response } from "../types";
import { PatientDocument } from "../entity/patient.model";
import { DEFAULT_PAGINATION_SIZE } from "../config";

@injectable()
export class PatientService {
    constructor() {
        logger.info(`[Event] Initializing...`);
    }

    public async create(request: Request, response: Response) {
        try {
            const patientInfo: CreatePatientDto = {
                name: request.body.name,
                phoneNumber: request.body.phoneNumber,
                dob: request.body.dob,
                description: request.body.description,
                medicalRecord: request.body.medicalRecord,
            };

            const event = await PatientRepository.create(patientInfo);

            response.composer.success(event);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            response.composer.badRequest(error.message);
        }
    }

    public async editOne(request: Request, response: Response) {
        try {
            const patientId = new Types.ObjectId(request.params.patientId);
            const patient = await PatientRepository.getById(patientId);

            if (!patient) {
                throw new Error(`Patient not found`);
            }

            const info: EditPatientDto = {
                name: request.body.name || patient.name,
                phoneNumber: request.body.phoneNumber || patient.phoneNumber,
                dob: request.body.dob || patient.dob,
                description: request.body.description || patient.description,
                medicalRecord:
                    request.body.medicalRecord || patient.medicalRecord,
            };

            const updatedEvent = await PatientRepository.editOne(
                patientId,
                info
            );

            response.composer.success(updatedEvent);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            response.composer.badRequest(error.message);
        }
    }

    public async getById(request: Request, response: Response) {
        try {
            const patientId = new Types.ObjectId(request.params.patientId);
            const patient = await PatientRepository.getById(patientId, {});

            if (!patient) {
                throw new Error(`Patient not found`);
            }

            response.composer.success(patient);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            response.composer.badRequest(error.message);
        }
    }

    public async getAll(request: Request, response: Response) {
        try {
            const query: FilterQuery<PatientDocument> = {};

            if (request.query.name) {
                query.name = {
                    $regex: decodeURIComponent(request.query.name as string),
                };
            }

            const isUsePagination =
                request.query.pagination === undefined ||
                request.query.pagination === "true";

            const pageSize: number = request.query.pageSize
                ? parseInt(request.query.pageSize as string)
                : DEFAULT_PAGINATION_SIZE;
            const pageNumber: number = request.query.pageNumber
                ? parseInt(request.query.pageNumber as string)
                : 1;

            if (isUsePagination) {
                const [total, result] = await PatientRepository.getPaginated(
                    query,
                    {
                        __v: 0,
                    },
                    [],
                    pageSize,
                    pageNumber
                );

                response.composer.success({
                    total,
                    pageCount: Math.max(Math.ceil(total / pageSize), 1),
                    pageSize,
                    result,
                });
            } else {
                const result = await PatientRepository.get(
                    query,
                    {
                        __v: 0,
                    },
                    []
                );

                response.composer.success({
                    total: result.length,
                    result,
                });
            }
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            response.composer.badRequest(error.message);
        }
    }

    public async deleteOne(request: Request, response: Response) {
        try {
            const patientId = new Types.ObjectId(request.params.patientId);
            const patient = await PatientRepository.getById(patientId);

            if (!patient) {
                throw new Error(`Patient not found`);
            }

            const deletedEvent = await PatientRepository.deleteOne(patientId);

            response.composer.success(deletedEvent);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            response.composer.badRequest(error.message);
        }
    }
}
