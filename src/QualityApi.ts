import Response from "./QualityApiResponse.ts";
import Body from "./QualityApiBody.ts";
import EndpointBuilder from "./QualityApiEndpointBuilder.ts";

namespace QualityApi {

    export function builder() {
        return new EndpointBuilder();
    }

    export namespace Responses {

        // 2xx (Success)

        export function ok<Json extends Body = any>(json?: Json) {
            _(200, json);
        }

        export function created<Json extends Body = any>(json?: Json) {
            _(201, json);
        }

        export function noContent() {
            _(204);
        }


        // 4xx (Client error)

        export function badRequest<Json extends Body = any>(json?: Json) {
            _(400, json);
        }

        export function unauthorized<Json extends Body = any>(json?: Json) {
            _(401, json);
        }

        export function forbidden<Json extends Body = any>(json?: Json) {
            _(403, json);
        }

        export function notFound<Json extends Body = any>(json?: Json) {
            _(404, json);
        }

        export function conflict<Json extends Body = any>(json?: Json) {
            _(409, json);
        }


        // 5xx (Server error)

        export function internalServerError<Json extends Body = any>(json: Json) {
            _(500, json);
        }


        // Other

        export function _<Json extends Body>(status: number, json?: Json) {
            return new Response(status, json);
        }

    }

}

export default QualityApi;