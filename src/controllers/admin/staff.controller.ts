import { inject, injectable } from "inversify";
import { Router } from "express";
import { Request, Response, ServiceType } from "../../types";
import { StaffService } from "../../services/staff.service";
import { logger } from "../../lib/logger";
import { CreateStaffDto } from "../../lib/dto/staff.dto";
import { FilterQuery, Types } from "mongoose";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { Controller } from "../controller";

@injectable()
export class AdminStaffController implements Controller {
  public readonly path = "/staff";
  public readonly router = Router();

  constructor(
    @inject(ServiceType.Staff) private staffService: StaffService
  ) {
    this.router.post("/", this.create.bind(this));
    this.router.patch("/:staffId", this.editOne.bind(this));
    this.router.get("/:staffId", this.getById.bind(this));
    this.router.get("/", this.getAll.bind(this));
    this.router.delete("/:staffId", this.deleteOne.bind(this));
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

      console.log("HERE")
      const staff = await this.staffService.create(staffInfo);
      console.log("HERE")

      response.composer.success(staff);
    } catch (error: any) {
      logger.error(error.message);
      response.composer.badRequest(error.message);
    }
  }

  public async editOne(request: Request, response: Response) {
    try {
      const staffId = new Types.ObjectId(request.params.staffId);
      const staff = await this.staffService.getById(staffId);
      if (!staff) {
        throw new Error("Staff not found");
      }

      const updatePayload = { ...request.body };

      const updatedStaff = await this.staffService.editOne(staffId, updatePayload);

      response.composer.success(updatedStaff);
    } catch (error: any) {
      logger.error(error.message);
      response.composer.badRequest(error.message);
    }
  }

  public async getById(request: Request, response: Response) {
    try {
      const staffId = new Types.ObjectId(request.params.staffId);
      const staff = await this.staffService.getById(staffId, {});
      if (!staff) {
        throw new Error("Staff not found");
      }
      response.composer.success(staff);
    } catch (error: any) {
      logger.error(error.message);
      response.composer.badRequest(error.message);
    }
  }

  public async getAll(request: Request, response: Response) {
    try {
      const query: FilterQuery<any> = {};

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
        const [total, result] = await this.staffService.getPaginated(
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
        const result = await this.staffService.get(query, { __v: 0 }, []);

        response.composer.success({
          total: result.length,
          result,
        });
      }
    } catch (error: any) {
      logger.error(error.message);
      response.composer.badRequest(error.message);
    }
  }
  public async deleteOne(request: Request, response: Response) {
    try {
      const staffId = new Types.ObjectId(request.params.staffId);
      const staff = await this.staffService.getById(staffId);
      if (!staff) {
        throw new Error("Staff not found");
      }

      const deletedStaff = await this.staffService.deleteOne(staffId);
      response.composer.success(deletedStaff);
    } catch (error: any) {
      logger.error(error.message);
      response.composer.badRequest(error.message);
    }
  }
}
