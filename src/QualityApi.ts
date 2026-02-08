import Store from "./_internal/Store";

import { QualityApiEndpointBuilder as EndpointBuilder } from "./QualityApiEndpointBuilder";
import { type QualityApiBody } from "./QualityApiBody";
import { type QualityApiConfig as Config } from "./QualityApiConfig";
import { type QualityApiRequestContentType as ContentType } from "./QualityApiContentType";
import { getBodyContentType } from "./_internal/util-functions";

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
    export function builder<T extends ContentType>(contentType?: T) {
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

        function generate(statusCode: number) {
            return <Body extends QualityApiBody>(
                body?: Body,
                contentType: string | undefined = getBodyContentType(body)
            ) => _<Body>(
                statusCode,
                body,
                contentType
            );
        }

        function generateNoBody(statusCode: number) {
            return () => _(statusCode);
        }


        // 2xx - Success

        /** 200 OK */
        export const ok = generate(200);

        /** 201 Created */
        export const created = generate(201);

        /** 202 Accepted */
        export const accepted = generate(202);

        /** 204 No content */
        export const noContent = generateNoBody(204);


        // 4xx - Client error

        /** 400 Bad request */
        export const badRequest = generate(400);

        /** 401 Unauthorized */
        export const unauthorized = generate(401);

        /** 403 Forbidden */
        export const forbidden = generate(403);

        /** 404 Not found */
        export const notFound = generate(404);

        /** 409 Conflict */
        export const conflict = generate(400);


        // 5xx - Client error

        /** 500 Internal server error */
        export const internalServerError = generate(500);


        // Other

        /** Creates a response outside of the predefined HTTP codes. */
        export function _<Body extends QualityApiBody>(status: number, body?: Body, contentType: string | undefined = getBodyContentType(body)) {
            const isBlob = body instanceof Blob;
            const isString = typeof body === "string";

            const isJson =
                !isBlob &&
                !isString;

            return new Response(
                isJson ? JSON.stringify(body) : body,
                {
                    status,
                    headers: {
                        ...(contentType && { "Content-Type": contentType })
                    }
                }
            );
        }

    }

}

export default QualityApi;