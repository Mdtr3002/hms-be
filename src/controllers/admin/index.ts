import { Router } from "express";
import { injectable } from "inversify";
import container from "../../container";
import { AdminChapterController } from "./chapter.controller";
import { AdminSubjectController } from "./subject.controller";
import { AdminQuestionController } from "./question.controller";
import { AdminQuizController } from "./quiz.controller";
import { AdminExamController } from "./exam.controller";
import recordRoutePrefix from "../../lib/record-route-prefix";
import { AdminEventController } from "./event.controller";
import { AdminNewsController } from "./news.controller";
import { AdminPatientController } from "./patient.controller";
import { AdminStaffController } from "./staff.controller";
import { Controller } from "../controller";

@injectable()
export class AdminController extends Controller {
    public readonly router = Router();
    public readonly path = "/admin";

    private SUBROUTES: Controller[] = [
        container.resolve<AdminSubjectController>(AdminSubjectController),
        container.resolve<AdminChapterController>(AdminChapterController),
        container.resolve<AdminQuestionController>(AdminQuestionController),
        container.resolve<AdminQuizController>(AdminQuizController),
        container.resolve<AdminExamController>(AdminExamController),
        container.resolve<AdminEventController>(AdminEventController),
        container.resolve<AdminNewsController>(AdminNewsController),
        container.resolve<AdminPatientController>(AdminPatientController),
        container.resolve<AdminStaffController>(AdminStaffController),
    ];

    constructor() {
        super();

        this.SUBROUTES.forEach((controller) => {
            console.log(container.isBound(controller.constructor.name), controller.path);
            this.router.use(
                controller.path,
                recordRoutePrefix(controller.path),
                controller.router
            );
        });
    }
}
