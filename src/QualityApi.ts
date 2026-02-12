import InternalStore from "./_internal/InternalStore";
import getBodyContentType from "./_internal/util-functions/getBodyContentType";

import { EndpointBuilder } from "./EndpointBuilder";
import { CONFIGURATION_STORE_KEY } from "./_internal/globals";
import { Next } from "./Next";
import { type Configuration } from "./Configuration";
import { type RequestContentType } from "./RequestContentType";
import { type ResponseConfiguration } from "./ResponseConfiguration";
import { StatusCode } from "./StatusCode";
import { QualityApiError } from "./QualityApiError";

type ContentTypeMap = {
    [RequestContentType.JSON]: Awaited<ReturnType<Request["json"]>>;
    [RequestContentType.Blob]: Awaited<ReturnType<Request["blob"]>>;
    [RequestContentType.Bytes]: Awaited<ReturnType<Request["bytes"]>>;
    [RequestContentType.Text]: Awaited<ReturnType<Request["text"]>>;
    [RequestContentType.ArrayBuffer]: Awaited<ReturnType<Request["arrayBuffer"]>>;
    [RequestContentType.FormData]: Awaited<ReturnType<Request["formData"]>>;
};

namespace QualityApi {

    /**
     * Starts the building process of an endpoint.
     * Use class `EndpointBuilder`'s built-in methods (ex. `authenticate`, `body`) to build the endpoint.
     */
    export function createEndpointBuilder<T extends RequestContentType>(contentType?: T) {
        return new EndpointBuilder<
            false,
            ContentTypeMap[T],
            unknown,
            unknown
        >(contentType);
    }

    /** Simplifies the response process. */
    export function respond(status: number, config?: ResponseConfiguration) {
        const isBodyUndefined = !config?.body;

        if (status === StatusCode.NoContent) throw new QualityApiError("Response status is 204 (no content), but contains a body!");

        const isBodyBlob =
            !isBodyUndefined &&
            config.body instanceof Blob;

        const isBodyString =
            !isBodyUndefined &&
            typeof config.body === "string";

        const isBodyJson =
            !isBodyUndefined &&
            !isBodyBlob &&
            !isBodyString;

        const response =
            new Response(
                !isBodyUndefined
                    ? (isBodyJson ? JSON.stringify(config.body) : config.body) as BodyInit
                    : undefined,
                { status }
            );

        if (!config?.headers?.has("Content-Type"))
            response.headers.set("Content-Type", getBodyContentType(config?.body));

        for (const [name, value] of config?.headers?.entries() ?? [])
            response.headers.append(name, value);

        for (const cookie of config?.cookies ?? []) {
            response.headers.append("Set-Cookie", [
                `${cookie.name}=${cookie.value};`,
                cookie.domain && `Domain=${cookie.domain};`,
                cookie.path && `Path=${cookie.path};`,
                cookie.expires && `Expires=${cookie.expires};`,
                cookie.maxAge && `Max-Age=${cookie.maxAge};`,
                cookie.httpOnly && "HttpOnly;",
                cookie.secure && "Secure;",
                cookie.sameSite && `SameSite=${cookie.sameSite};`
            ].filter(Boolean).join(" "));
        }

        return response;
    }

    /** Defines the required configuration for Quality API. This should ideally be invoked inside the `next.config.[js|ts]` file. */
    export function configure(options: Configuration) {
        InternalStore.set(CONFIGURATION_STORE_KEY, options);
    }

    /** Shortcut for `new Next()`. */
    export function next() {
        return new Next();
    }

}

export default QualityApi;