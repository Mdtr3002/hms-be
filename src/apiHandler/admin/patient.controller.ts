import { inject, injectable } from "inversify";
import { Router } from "express";
import { RepositoryType } from "../../types";
import { PatientService } from "../../services";
import { Controller } from "../controller";

@injectable()
export class AdminPatientController implements Controller {
    public readonly path = "/patient";
    public readonly router = Router();

    constructor(
        @inject(RepositoryType.Patient) private patientService: PatientService
    ) {
        this.router.post("/", this.patientService.create.bind(this));

        this.router.patch(
            "/:patientId",
            this.patientService.editOne.bind(this)
        );

        this.router.get("/:patientId", this.patientService.getById.bind(this));
        this.router.get("/", this.patientService.getAll.bind(this));

        this.router.delete(
            "/:patientId",
            this.patientService.deleteOne.bind(this)
        );
    }
}
