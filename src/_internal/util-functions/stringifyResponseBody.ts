import { type ResponseBody } from "../../ResponseBody";

function stringifyResponseBody(body?: ResponseBody) {
    if (!body) return undefined;

    if (
        typeof body === "string" ||
        body instanceof Blob
    ) return body;
    else return JSON.stringify(body);
}

export default stringifyResponseBody;