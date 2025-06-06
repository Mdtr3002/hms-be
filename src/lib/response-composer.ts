import { NextFunction } from "express";
import { Response, Request } from "../types";

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_ALLOWED = 403,
    NOT_FOUND = 404,
    LOCKED = 423,
}

export class HttpResponseComposer {
    private res: Response;

    constructor(res: Response) {
        this.res = res;
    }

    private json(
        success: boolean,
        code: number,
        message: string,
        payload: any
    ) {
        this.res.status(code).send({
            success,
            code,
            message,
            payload,
        });
    }

    success(payload: any, message = "") {
        this.json(true, HttpStatus.OK, message, payload);
    }

    badRequest(message = "Parameter not correctly") {
        this.json(false, HttpStatus.BAD_REQUEST, message, {});
    }

    unauthorized(message = "Authorization failed") {
        this.json(false, HttpStatus.UNAUTHORIZED, message, {});
    }

    notAllowed(message = "Forbidden") {
        this.json(false, HttpStatus.NOT_ALLOWED, message, {});
    }

    notFound(message = "Resource not found") {
        this.json(false, HttpStatus.NOT_FOUND, message, {});
    }

    locked(message = "Unlock code required") {
        this.json(false, HttpStatus.LOCKED, message, {});
    }
}

export function applyHttpResponseComposer(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.composer = new HttpResponseComposer(res);
    next();
}
