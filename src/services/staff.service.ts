import { injectable } from "inversify";
import { logger } from "../lib/logger";
import { FilterQuery, Types } from "mongoose";
import StaffRepository from "../repository/staff.repository";
import { Request, Response } from "../types";
import { DEFAULT_PAGINATION_SIZE } from "../config";
import { CreateStaffDto } from "../lib/dto/staff.dto";
import { StaffDocument } from "../entity/staff.model";

@injectable()
export class StaffService {
    constructor() {
        logger.info(`[Staff] Initializing...`);
    }

    public async create(request: Request, response: Response) {
        try {
            const staffInfo: CreateStaffDto = {
                name: request.body.name,
                phoneNumber: request.body.phoneNumber,
                dob: request.body.dob,
                description: request.body.description,
                scheduleStartTime: request.body.scheduleStartTime,
                scheduleEndTime: request.body.scheduleEndTime,
                workDays: request.body.workDays,
                scheduleWorkDescription: request.body.scheduleWorkDescription,
                specialization: request.body.specialization,
                role: request.body.role, // "Doctor" or "Nurse"
            };

            const staff = await StaffRepository.create(staffInfo);

            response.composer.success(staff);
        } catch (error) {
            logger.error(error.message);
            response.composer.badRequest(error.message);
        }
    }

    public async editOne(request: Request, response: Response) {
        try {
            const staffId = new Types.ObjectId(request.params.staffId);
            const staff = await StaffRepository.getById(staffId);
            if (!staff) {
                throw new Error("Staff not found");
            }

            const updatePayload = { ...request.body };

            const updatedStaff = await StaffRepository.editOne(
                staffId,
                updatePayload
            );

            response.composer.success(updatedStaff);
        } catch (error) {
            logger.error(error.message);
            response.composer.badRequest(error.message);
        }
    }

    public async getById(request: Request, response: Response) {
        try {
            const staffId = new Types.ObjectId(request.params.staffId);
            const staff = await StaffRepository.getById(staffId, {});
            if (!staff) {
                throw new Error("Staff not found");
            }
            response.composer.success(staff);
        } catch (error) {
            logger.error(error.message);
            response.composer.badRequest(error.message);
        }
    }

    public async getAll(request: Request, response: Response) {
        try {
            const query: FilterQuery<StaffDocument> = {};

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
                const [total, result] = await StaffRepository.getPaginated(
                    query,
                    { __v: 0 },
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
                const result = await StaffRepository.get(query, { __v: 0 }, []);

                response.composer.success({
                    total: result.length,
                    result,
                });
            }
        } catch (error) {
            logger.error(error.message);
            response.composer.badRequest(error.message);
        }
    }
    public async deleteOne(request: Request, response: Response) {
        try {
            const staffId = new Types.ObjectId(request.params.staffId);
            const staff = await StaffRepository.getById(staffId);
            if (!staff) {
                throw new Error("Staff not found");
            }

            const deletedStaff = await StaffRepository.deleteOne(staffId);
            response.composer.success(deletedStaff);
        } catch (error) {
            logger.error(error.message);
            response.composer.badRequest(error.message);
        }
    }
}
