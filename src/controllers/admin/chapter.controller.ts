import { Router } from "express";
import { Request, Response, ServiceType } from "../../types";
import {
    ChapterService,
    QuestionService,
    QuizService,
    SubjectService,
} from "../../services/index";
import { inject } from "inversify";
import mongoose, { FilterQuery, Types } from "mongoose";
import { logger } from "../../lib/logger";
import _ from "lodash";
import { ChapterDocument } from "../../models/chapter.model";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { Controller } from "../controller";

export class AdminChapterController extends Controller {
    public readonly router = Router();
    public readonly path = "/chapter";

    constructor(
        @inject(ServiceType.Subject)
        private subjectService: SubjectService,
        @inject(ServiceType.Chapter) private chapterService: ChapterService,
        @inject(ServiceType.Question) private questionService: QuestionService,
        @inject(ServiceType.Quiz) private quizService: QuizService
    ) {
        super();

        this.router.post("/", this.create.bind(this));
        this.router.patch("/:chapterId", this.edit.bind(this));
        this.router.delete("/:chapterId", this.delete.bind(this));

        this.router.get("/", this.getAll.bind(this));
        this.router.get("/:chapterId", this.getById.bind(this));
    }

    async create(req: Request, res: Response) {
        try {
            const userId = new mongoose.Types.ObjectId(
                "6611621a2c6f1e2fdc4416d3"
            );
            const { name, description = "" } = req.body;
            const subject = new Types.ObjectId(req.body.subject);

            // const subjectExists = await this.subjectService.subjectExists(
            //     subject
            // );
            // if (!subjectExists) {
            //     throw new Error(`Subject does not exist`);
            // }

            const result = await this.chapterService.create(
                name,
                subject,
                description,
                userId
            );
            res.composer.success(result);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            res.composer.badRequest(error.message);
        }
    }

    async edit(req: Request, res: Response) {
        try {
            const chapterId = new Types.ObjectId(req.params.chapterId);

            const info = _.pick(req.body, ["name", "description"]);
            const result = await this.chapterService.editOneChapter(
                chapterId,
                info
            );
            if (!result) {
                throw new Error(`The requested chapter is not found`);
            }
            res.composer.success(result);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            res.composer.badRequest(error.message);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const chapterId = new Types.ObjectId(req.params.chapterId);

            const [materialWithThisChapter, questionWithThisChapter] =
                await Promise.all([
                    this.questionService.questionWithChapterExists(chapterId),
                    this.quizService.quizWithChapterExists(chapterId),
                ]);

            if (materialWithThisChapter) {
                throw new Error(
                    `This chapter is referenced by some materials. Please delete them first`
                );
            }
            if (questionWithThisChapter) {
                throw new Error(
                    `This chapter is referenced by some question. Please delete them first`
                );
            }

            const result = await this.chapterService.markAsDeleted(chapterId);
            if (!result) {
                throw new Error(`Chapter not found`);
            }
            res.composer.success(result);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            res.composer.badRequest(error.message);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const query: FilterQuery<ChapterDocument> = {};
            if (req.query.subject) {
                query.subject = new Types.ObjectId(req.query.subject as string);
            }
            if (req.query.name) {
                query.name = {
                    $regex: decodeURIComponent(req.query.name as string),
                };
            }

            const pageSize: number = req.query.pageSize
                ? parseInt(req.query.pageSize as string)
                : DEFAULT_PAGINATION_SIZE;
            const pageNumber: number = req.query.pageNumber
                ? parseInt(req.query.pageNumber as string)
                : 1;

            if (req.query.pagination === "false") {
                const result = await this.chapterService.getPopulated(
                    query,
                    {
                        __v: 0,
                    },
                    ["subject"]
                );
                res.composer.success({
                    total: result.length,
                    result,
                });
            } else {
                const [total, result] = await this.chapterService.getPaginated(
                    query,
                    {
                        __v: 0,
                    },
                    ["subject"],
                    pageSize,
                    pageNumber
                );

                res.composer.success({
                    total,
                    pageCount: Math.max(Math.ceil(total / pageSize), 1),
                    pageSize,
                    result,
                });
            }
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            res.composer.badRequest(error.message);
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const chapterId = new Types.ObjectId(req.params.chapterId);

            const result = await this.chapterService.getByIdPopulated(
                chapterId,
                {
                    __v: 0,
                },
                ["subject"]
            );

            if (!result) {
                throw new Error(`Chapter not found`);
            }

            res.composer.success(result);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            res.composer.badRequest(error.message);
        }
    }
}
