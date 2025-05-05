import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import { App } from "./app";
import container from "./container";
import { applyHttpResponseComposer } from "./lib/response-composer";

import { StaffService, PatientService } from "./services/index";

import { RepositoryType } from "./types";
import mongoose from "mongoose";

import { toNumber } from "lodash";
import { logger } from "./lib/logger";
import { AdminPatientController } from "./apiHandler/admin/patient.controller";
import { AdminStaffController } from "./apiHandler/admin/staff.controller";

logger.info(`Connecting to database at URI: ${process.env.DB_URI}`);
mongoose.connect(process.env.DB_URI);
mongoose.connection.once("connected", () => {
    logger.info("Database connection established");
});

// Binding service
container
    .bind<PatientService>(RepositoryType.Patient)
    .to(PatientService)
    .inSingletonScope();
container
    .bind<StaffService>(RepositoryType.Staff)
    .to(StaffService)
    .inSingletonScope();

// Initialize service first
Promise.all([
    // container.get<DatabaseService>(ServiceType.Database).initialize(),
]).then(() => {
    const patientService = new App(
        [container.resolve<AdminPatientController>(AdminPatientController)],
        toNumber(process.env.PATIENT_PORT),
        [applyHttpResponseComposer]
    );

    const staffService = new App(
        [container.resolve<AdminStaffController>(AdminStaffController)],
        toNumber(process.env.STAFF_PORT),
        [applyHttpResponseComposer]
    );

    patientService.listen();
    staffService.listen();

    if (process.send) {
        process.send("ready");
    }
});
