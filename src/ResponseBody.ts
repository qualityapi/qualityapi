import { type EmptyJsonObject } from "./utils";

export type ResponseBody =
    [] |
    EmptyJsonObject |
    Blob |
    string |
    number;