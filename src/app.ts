import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import useragent from "express-useragent";
import http from "http";
import { Server } from "socket.io";

import cookieSession from "cookie-session";
import compression from "compression";
import { logger } from "./lib/logger";
import * as socketio from "socket.io";
import recordRoutePrefix from "./lib/record-route-prefix";
import { Controller } from "./apiHandler/controller";

class App {
    public app: Express;
    public server: http.Server;
    public port: number;
    public io: Server;

    constructor(controllers: Controller[], port: number, middlewares: any[]) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares(middlewares);
        this.initializeControllers(controllers);

        this.io = new socketio.Server(this.server, {
            cors: {
                origin: "*",
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                preflightContinue: false,
                optionsSuccessStatus: 204,
            },
        });
    }

    private initializeMiddlewares(middlewares: any[]) {
        this.app.use(
            compression({
                threshold: 0,
                filter: (req, res) => {
                    if (req.headers["x-no-compression"]) {
                        return false;
                    }
                    return compression.filter(req, res);
                },
            })
        );
        this.app.disable("x-powered-by");
        this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
        this.app.use(bodyParser.json({ limit: "50mb" }));
        this.app.use(cors());
        this.app.use(useragent.express());

        // this.app.use(
        //     "/static",
        //     express.static(path.join(process.env.WORKING_DIR, "static"))
        // );

        middlewares.forEach((m) => this.app.use(m));
        // this.app.use(passport.session());
        this.app.use(
            cookieSession({
                maxAge: 24 * 60 * 60 * 1000,
                keys: [process.env.COOKIE_KEY],
            })
        );
    }

    public applyExternalMiddleware(middleware: any) {
        this.app.use(middleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(
                controller.path,
                recordRoutePrefix(controller.path),
                controller.router
            );
        });
    }

    public listen() {
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                preflightContinue: false,
                optionsSuccessStatus: 204,
            },
        });

        this.server.listen(this.port, () => {
            logger.info(
                `${process.env.SERVICE_NAME} listening on port ${this.port}`
            );
        });
    }
}

export { App };
