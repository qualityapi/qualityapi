import Store from "./_internal/Store";

import { QualityApiResponse as Response } from "./QualityApiResponse";
import { QualityApiEndpointBuilder as EndpointBuilder } from "./QualityApiEndpointBuilder";
import { type QualityApiBody as Body } from "./QualityApiBody";
import { type QualityApiConfig } from "./QualityApiConfig";

namespace QualityApi {

    export function builder() {
        return new EndpointBuilder();
    }

    export function config(options: QualityApiConfig) {
        Store.set("NextAuthConfig", options.nextAuth);
    }

    export namespace Respond {

        // 2xx (Success)

        export function ok<Json extends Body = any>(json?: Json) {
            return _(200, json);
        }

        export function created<Json extends Body = any>(json?: Json) {
            return _(201, json);
        }

        export function noContent() {
            return _(204);
        }


        // 4xx (Client error)

        export function badRequest<Json extends Body = any>(json?: Json) {
            return _(400, json);
        }

        export function unauthorized<Json extends Body = any>(json?: Json) {
            return _(401, json);
        }

        export function forbidden<Json extends Body = any>(json?: Json) {
            return _(403, json);
        }

        export function notFound<Json extends Body = any>(json?: Json) {
            return _(404, json);
        }

        export function conflict<Json extends Body = any>(json?: Json) {
            return _(409, json);
        }


        // 5xx (Server error)

        export function internalServerError<Json extends Body = any>(json: Json) {
            return _(500, json);
        }


        // Other

        export function _<Json extends Body>(status: number, json?: Json) {
            return new Response(status, json);
        }

    }

}

export default QualityApi;