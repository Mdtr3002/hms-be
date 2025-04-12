import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import { App } from "./app";
import container from "./container";
import { applyHttpResponseComposer } from "./lib/response-composer";

import {
    SubjectService,
    QuizService,
    ChapterService,
    QuestionService,
    UserActivityService,
    ExamService,
    EventService,
    UserService,
    NewsService,
    PatientService,
} from "./services/index";

import { AdminController } from "./controllers/index";

import { ServiceType } from "./types";
import mongoose from "mongoose";

import { toNumber } from "lodash";
import { logger } from "./lib/logger";
import { StaffService } from "./services/staff.service";

logger.info(`Connecting to database at URI: ${process.env.DB_URI}`);
mongoose.connect(process.env.DB_URI);
mongoose.connection.once("connected", () => {
    logger.info("Database connection established");
});

// Binding service
container
    .bind<UserService>(ServiceType.User)
    .to(UserService)
    .inSingletonScope();
container
    .bind<SubjectService>(ServiceType.Subject)
    .to(SubjectService)
    .inSingletonScope();
container
    .bind<ChapterService>(ServiceType.Chapter)
    .to(ChapterService)
    .inSingletonScope();
container
    .bind<QuestionService>(ServiceType.Question)
    .to(QuestionService)
    .inSingletonScope();
container
    .bind<QuizService>(ServiceType.Quiz)
    .to(QuizService)
    .inSingletonScope();
container
    .bind<UserActivityService>(ServiceType.UserActivity)
    .to(UserActivityService)
    .inSingletonScope();
container
    .bind<ExamService>(ServiceType.Exam)
    .to(ExamService)
    .inSingletonScope();
container
    .bind<EventService>(ServiceType.Event)
    .to(EventService)
    .inSingletonScope();
container
    .bind<NewsService>(ServiceType.News)
    .to(NewsService)
    .inSingletonScope();
container
    .bind<PatientService>(ServiceType.Patient)
    .to(PatientService)
    .inSingletonScope();
container
    .bind<StaffService>(ServiceType.Staff)
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
