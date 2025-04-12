import { inject, injectable } from "inversify";
import { Router } from "express";
import { RepositoryType } from "../../types";
import { StaffService } from "../../services/staff.service";
import { Controller } from "../controller";

@injectable()
export class AdminStaffController implements Controller {
    public readonly path = "/staff";
    public readonly router = Router();

    constructor(
        @inject(RepositoryType.Staff) private staffService: StaffService
    ) {
        this.router.post("/", this.staffService.create.bind(this));
        this.router.patch("/:staffId", this.staffService.editOne.bind(this));
        this.router.get("/:staffId", this.staffService.getById.bind(this));
        this.router.get("/", this.staffService.getAll.bind(this));
        this.router.delete("/:staffId", this.staffService.deleteOne.bind(this));
    }
}
