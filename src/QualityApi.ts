import Store from "./_internal/Store";

import { QualityApiResponse as Response } from "./QualityApiResponse";
import { QualityApiEndpointBuilder as EndpointBuilder } from "./QualityApiEndpointBuilder";
import { type QualityApiBody as Body } from "./QualityApiBody";
import { type QualityApiConfig as Config } from "./QualityApiConfig";
import { type QualityApiContentType as ContentType } from "./QualityApiContentType";

type ContentTypeMap = {
    [ContentType.JSON]: Awaited<ReturnType<Request["json"]>>;
    [ContentType.Blob]: Awaited<ReturnType<Request["blob"]>>;
    [ContentType.Bytes]: Awaited<ReturnType<Request["bytes"]>>;
    [ContentType.Text]: Awaited<ReturnType<Request["text"]>>;
    [ContentType.ArrayBuffer]: Awaited<ReturnType<Request["arrayBuffer"]>>;
    [ContentType.FormData]: Awaited<ReturnType<Request["formData"]>>;
};

namespace QualityApi {

    /** Starts the building process of an endpoint. Use `QualityApiEndpointBuilder`'s built-in methods (ex. `authenticate`, `body`) to build the endpoint. */
    export function builder<T extends ContentType>(contentType: T) {
        return new EndpointBuilder<
            false,
            ContentTypeMap[T],
            unknown,
            unknown
        >(contentType);
    }

    /** Defines the required configuration for Quality API. This should ideally be invoked inside the `next.config.[js|ts]` file. */
    export function config(options: Config) {
        Store.set("NextAuthConfig", options.nextAuth);
    }

    /** Contains the most commonly used HTTP response codes. Use `_` function to define your own. */
    export namespace Respond {

        // 2xx (Success)

        /** 200 - OK */
        export function ok<Json extends Body = any>(json?: Json) {
            return _(200, json);
        }

        /** 201 - Created */
        export function created<Json extends Body = any>(json?: Json) {
            return _(201, json);
        }

        /** 204 - No content */
        export function noContent() {
            return _(204);
        }


        // 4xx (Client error)

        /** 400 - Bad request */
        export function badRequest<Json extends Body = any>(json?: Json) {
            return _(400, json);
        }

        /** 401 - Unauthorized */
        export function unauthorized<Json extends Body = any>(json?: Json) {
            return _(401, json);
        }

        /** 403 - Forbidden */
        export function forbidden<Json extends Body = any>(json?: Json) {
            return _(403, json);
        }

        /** 404 - Not found */
        export function notFound<Json extends Body = any>(json?: Json) {
            return _(404, json);
        }

        /** 409 - Conflict */
        export function conflict<Json extends Body = any>(json?: Json) {
            return _(409, json);
        }


        // 5xx (Server error)

        /** 500 - Internal server error */
        export function internalServerError<Json extends Body = any>(json: Json) {
            return _(500, json);
        }


        // Other

        /** Creates a response outside of the predefined HTTP codes. */
        export function _<Json extends Body>(status: number, json?: Json) {
            return new Response(status, json);
        }

    }

}

export default QualityApi;