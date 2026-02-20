import { type JsonObject } from "./utils";

export type ResponseBody =
    [] |
    JsonObject |
    Blob |
    string |
    number;