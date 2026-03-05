import { type JsonObject } from "./utils";

export type ResponseBody =
    Array<ResponseBody> |
    JsonObject |
    Blob |
    string |
    number;