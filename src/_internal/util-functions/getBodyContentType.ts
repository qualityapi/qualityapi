import { type ResponseBody } from "../../ResponseBody";
import { BLOB_DEFAULT_CONTENT_TYPE } from "../globals";

function getBodyContentType(body?: ResponseBody) {
    if (body instanceof Blob) return BLOB_DEFAULT_CONTENT_TYPE;
    else if (typeof body === "string") return "text/plain";
    else return "application/json";
}

export default getBodyContentType;