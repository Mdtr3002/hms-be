import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import { App } from "./app";
import container from "./container";
import { applyHttpResponseComposer } from "./lib/response-composer";

import { StaffService, PatientService } from "./services/index";

import { AdminController } from "./apiHandler/index";

import { RepositoryType } from "./types";
import mongoose from "mongoose";

import { toNumber } from "lodash";
import { logger } from "./lib/logger";

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
    const app = new App(
        [container.resolve<AdminController>(AdminController)],
        toNumber(process.env.PORT),
        [applyHttpResponseComposer]
    );

    app.listen();

    if (process.send) {
        process.send("ready");
    }
});
