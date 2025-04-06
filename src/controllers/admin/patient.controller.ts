import { inject, injectable } from "inversify";
import { Router } from "express";
import { Request, Response, ServiceType } from "../../types";
import { PatientService } from "../../services";
import { logger } from "../../lib/logger";
import { CreatePatientDto, EditPatientDto } from "../../lib/dto/patient.dto";
import { EventDocument } from "../../models/event.model";
import { FilterQuery, Types } from "mongoose";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { Controller } from "../controller";

@injectable()
export class AdminPatientController implements Controller {
    public readonly path = "/patient";
    public readonly router = Router();

    constructor(
        @inject(ServiceType.Patient) private patientService: PatientService
    ) {
        this.router.post("/", this.create.bind(this));

        this.router.patch("/:patientId", this.editOne.bind(this));

        this.router.get("/:patientId", this.getById.bind(this));
        this.router.get("/", this.getAll.bind(this));

        this.router.delete("/:patientId", this.deleteOne.bind(this));
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

            const event = await this.patientService.create(patientInfo);

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
            const patient = await this.patientService.getById(patientId);

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

            const updatedEvent = await this.patientService.editOne(
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
            const patient = await this.patientService.getById(patientId, {});

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
            const query: FilterQuery<EventDocument> = {};

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
                const [total, result] = await this.patientService.getPaginated(
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
                const result = await this.patientService.get(
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
            const patient = await this.patientService.getById(patientId);

            if (!patient) {
                throw new Error(`Patient not found`);
            }

            const deletedEvent = await this.patientService.deleteOne(patientId);

            response.composer.success(deletedEvent);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            response.composer.badRequest(error.message);
        }
    }
}
