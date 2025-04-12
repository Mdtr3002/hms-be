import { Router } from "express";
import { injectable } from "inversify";
import container from "../../container";
import recordRoutePrefix from "../../lib/record-route-prefix";
import { AdminPatientController } from "./patient.controller";
import { AdminStaffController } from "./staff.controller";
import { Controller } from "../controller";

@injectable()
export class AdminController extends Controller {
    public readonly router = Router();
    public readonly path = "/admin";

    private SUBROUTES: Controller[] = [
        container.resolve<AdminPatientController>(AdminPatientController),
        container.resolve<AdminStaffController>(AdminStaffController),
    ];

    constructor() {
        super();

        this.SUBROUTES.forEach((controller) => {
            console.log(
                container.isBound(controller.constructor.name),
                controller.path
            );
            this.router.use(
                controller.path,
                recordRoutePrefix(controller.path),
                controller.router
            );
        });
    }
}
