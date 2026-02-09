import InternalStore from "./_internal/InternalStore";

import { EndpointBuilder } from "./EndpointBuilder";
import { CONFIGURATION_STORE_KEY } from "./_internal/globals";
import { Next } from "./Next";
import { type Configuration } from "./Configuration";
import { type RequestContentType } from "./RequestContentType";

type ContentTypeMap = {
    [RequestContentType.JSON]: Awaited<ReturnType<Request["json"]>>;
    [RequestContentType.Blob]: Awaited<ReturnType<Request["blob"]>>;
    [RequestContentType.Bytes]: Awaited<ReturnType<Request["bytes"]>>;
    [RequestContentType.Text]: Awaited<ReturnType<Request["text"]>>;
    [RequestContentType.ArrayBuffer]: Awaited<ReturnType<Request["arrayBuffer"]>>;
    [RequestContentType.FormData]: Awaited<ReturnType<Request["formData"]>>;
};

namespace QualityApi {

    /** Starts the building process of an endpoint. Use `EndpointBuilder`'s built-in methods (ex. `authenticate`, `body`) to build the endpoint. */
    export function builder<T extends RequestContentType>(contentType?: T) {
        return new EndpointBuilder<
            false,
            ContentTypeMap[T],
            unknown,
            unknown
        >(contentType);
    }

    /** Defines the required configuration for Quality API. This should ideally be invoked inside the `next.config.[js|ts]` file. */
    export function configure(options: Configuration) {
        InternalStore.set(CONFIGURATION_STORE_KEY, options);
    }

    /** Alias for `new Next()`. */
    export function next() {
        return new Next();
    }

}

export default QualityApi;