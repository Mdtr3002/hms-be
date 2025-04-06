import { ConnectionOptions } from "bullmq/dist/esm";

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;

export const EMAIL_WHITE_LIST = [
    "lygioian@gmail.com",
    "tndangkhoa218@gmail.com",
];

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

export enum Semester {
    SEMESTER_181 = "SEMESTER_181",
    SEMESTER_182 = "SEMESTER_182",
    SEMESTER_183 = "SEMESTER_183",

    SEMESTER_191 = "SEMESTER_191",
    SEMESTER_192 = "SEMESTER_192",
    SEMESTER_193 = "SEMESTER_193",

    SEMESTER_201 = "SEMESTER_201",
    SEMESTER_202 = "SEMESTER_202",
    SEMESTER_203 = "SEMESTER_203",

    SEMESTER_211 = "SEMESTER_211",
    SEMESTER_212 = "SEMESTER_212",
    SEMESTER_213 = "SEMESTER_213",

    SEMESTER_221 = "SEMESTER_221",
    SEMESTER_222 = "SEMESTER_222",
    SEMESTER_223 = "SEMESTER_223",

    SEMESTER_231 = "SEMESTER_231",
    SEMESTER_232 = "SEMESTER_232",
    SEMESTER_233 = "SEMESTER_233",

    SEMESTER_241 = "SEMESTER_241",
    SEMESTER_242 = "SEMESTER_242",
    SEMESTER_243 = "SEMESTER_243",

    SEMESTER_251 = "SEMESTER_251",
    SEMESTER_252 = "SEMESTER_252",
    SEMESTER_253 = "SEMESTER_253",

    SEMESTER_261 = "SEMESTER_261",
    SEMESTER_262 = "SEMESTER_262",
    SEMESTER_263 = "SEMESTER_263",
}

export const QUEUE_NAMES = {
    DATA_INGESTION: "data_ingestion",
} as const;

const QUEUE_HOST = process.env.QUEUE_HOST as string;
const QUEUE_PORT = parseInt(process.env.QUEUE_PORT as string, 10);

export const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY as string;

export const QUEUE_CONNECTION_OPTION: ConnectionOptions = {
    host: QUEUE_HOST,
    port: QUEUE_PORT,
};
