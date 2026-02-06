import type { QualityApiBody } from "../QualityApiBody";
import { BLOB_CONTENT_TYPE } from "./globals";
import { Logger } from "./Logger";

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

export function getBodyContentType(body?: QualityApiBody) {
    if (body instanceof Blob) return BLOB_CONTENT_TYPE;
    else if (typeof body === "string") return "text/plain";
    else return "application/json";
}

export function testContentHeader(headers: Headers) {
    const header = headers.get("Content-Type");

    if (!header) return;
    if (header?.split(";")[0] !== BLOB_CONTENT_TYPE) return;

    Logger.warn("Specify a \"Content-Type\" header for responses of type blob");
}