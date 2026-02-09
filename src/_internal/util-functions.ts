import { type ResponseBody } from "../ResponseBody";
import { Logger } from "./Logger";
import { type Configuration } from "../Configuration";
import { BLOB_DEFAULT_CONTENT_TYPE, CONFIGURATION_STORE_KEY } from "./globals";

import jwt from "jsonwebtoken";

export function urlSearchParamsToObj(urlSearchParams: URLSearchParams) {
    let result: { [_: string]: any } = {};

    for (const key of urlSearchParams.keys()) {
        const value = urlSearchParams.getAll(key);

        switch (value.length) {
            case 0: break;

            case 1:
                result[key] = value[0];
                break;

            default: result[key] = value;
        }
    }

    return result;
}

export function formatZodError(step: string, error: { path: string[]; message: string; }[]) {
    try {
        return error.reduce((root, current) => ({
            ...root,
            properties: {
                ...root.properties,
                [current.path.join(".")]: current.message
            }
        }), { step, properties: {} });
    }
    catch {
        return error;
    }
}

export function getBodyContentType(body?: ResponseBody) {
    if (body instanceof Blob) return BLOB_DEFAULT_CONTENT_TYPE;
    else if (typeof body === "string") return "text/plain";
    else return "application/json";
}

export function testContentHeader(headers: Headers) {
    const header = headers.get("Content-Type");

    if (!header) return;
    if (header?.split(";")[0] !== BLOB_DEFAULT_CONTENT_TYPE) return;

    Logger.warn("Specify a \"Content-Type\" header for responses of type blob");
}

export async function getUserFromHeaders(
    headers: Headers,
    secret: string,
    getUserFromJwt: NonNullable<Configuration["authentication"]>["getUser"]
) {
    const header = headers.get("Cookie");

    if (!header) return null;

    const split = header.split("=");

    if (split[0] !== "jwt") return null;

    const token = split.splice(1).join("=");

    try {
        const verification = jwt.verify(token, secret);

        return await getUserFromJwt(verification);
    }
    catch {
        return null;
    }
}