import { Request as ERequest, Response as EResponse } from "express";
import { HttpResponseComposer } from "./lib/response-composer";

export interface Request extends ERequest {
    routePrefix?: string;
}

export interface Response extends EResponse {
    composer?: HttpResponseComposer;
}

export const RepositoryType = {
    Patient: Symbol.for("Patient"),
    Staff: Symbol.for("Staff"),
};

export enum PrivacyType {
    PUBLIC = "public",
    PROTECTED = "protected",
    PRIVATE = "private",
}

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}
