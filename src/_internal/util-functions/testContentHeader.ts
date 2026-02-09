import { BLOB_DEFAULT_CONTENT_TYPE } from "../globals";
import { Logger } from "../Logger";

function testContentHeader(headers: Headers) {
    const header = headers.get("Content-Type");

    if (!header) return;
    if (header?.split(";")[0] !== BLOB_DEFAULT_CONTENT_TYPE) return;

    Logger.warn("Specify a \"Content-Type\" header for responses of type blob");
}

export default testContentHeader;