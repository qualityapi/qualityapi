import InternalStore from "./_internal/InternalStore";
import QualityApi from "./QualityApi";
import formatZodError from "./_internal/util-functions/formatZodError";
import testContentHeader from "./_internal/util-functions/testContentHeader";
import urlSearchParamsToObj from "./_internal/util-functions/urlSearchParamsToObj";

import { Next } from "./Next";
import { type Middleware } from "./Middleware";
import { type ResponseBody } from "./ResponseBody";
import { type Request } from "./Request";
import { type Configuration } from "./Configuration";
import { type User } from "./User";
import { RequestContentType as ContentType } from "./RequestContentType";
import { Logger } from "./_internal/Logger";
import { StatusCode } from "./StatusCode";
import { CONFIGURATION_STORE_KEY } from "./_internal/globals";

import z, { ZodObject, type ZodRawShape, type ZodType } from "zod";

export class EndpointBuilder<
    Authenticated extends boolean,
    Body,
    Params,
    SearchParams
> {

    private config: Configuration = InternalStore.get<Configuration>(CONFIGURATION_STORE_KEY);

    private middlewares: Middleware<any>[] = [];
    private user: User | null = null;

    private _body: any = null;
    private _params: any = null;
    private _searchParams: any = null;

    private _contentType: ContentType | null;

    constructor(contentType?: ContentType) {
        this._contentType = contentType ?? null;
    }

    private getRequestData(nextRequest: globalThis.Request): Request<Authenticated, Body, Params, SearchParams> {
        return {
            user: this.user!,
            body: this._body,
            params: this._params,
            searchParams: this._searchParams,
            _request: nextRequest
        };
    }

    private async parseRequestBody(request: globalThis.Request) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                switch (this._contentType) {
                    case ContentType.JSON: return resolve(await request.json());
                    case ContentType.Blob: return resolve(await request.blob());
                    case ContentType.Bytes: return resolve(await request.bytes());
                    case ContentType.Text: return resolve(await request.text());
                    case ContentType.ArrayBuffer: return resolve(await request.arrayBuffer());
                    case ContentType.FormData: return resolve(await request.formData());

                    default: return resolve(null);
                }
            }
            catch {
                reject();
            }
        });
    }

    /** Adds a custom middleware function. */
    public middleware(fn: Middleware<Authenticated>) {
        this.middlewares.push(fn);

        return this;
    }

    /** Adds internal middleware that verifies end user's authentication. */
    public authenticate() {
        if (!this.config.authentication)
            Logger.warn("`.authenticate` middleware is defined, but authentication is not configured!");

        this.middlewares.push(async () => {
            if (!this.user) return QualityApi.respond(StatusCode.Unauthorized);

            return QualityApi.next();
        });

        return this as EndpointBuilder<
            true,
            Body,
            Params,
            SearchParams
        >;
    }

    /** Adds internal middleware that validates the request body. */
    public body<T extends ZodType>(schema: T) {
        if (this._contentType === null)
            Logger.warn("`.body` middleware is defined, but no content type is given!");

        this.middlewares.push(async ({ body }) => {

            const parseResult = await schema.safeParseAsync(body);

            if (!parseResult.success) {
                let error;

                try {
                    error = formatZodError("Body", JSON.parse(parseResult.error.message));
                }
                catch {
                    error = parseResult.error.message;
                }

                return QualityApi.respond(StatusCode.BadRequest, { body: error });
            }

            this._body = parseResult.data;

            return QualityApi.next();
        });

        return this as EndpointBuilder<
            Authenticated,
            z.infer<T>,
            Params,
            SearchParams
        >;
    }

    /**
     * Adds internal middleware that validates the request's parameters (slugs).
     *
     * @param schema Should only contain coerce fields, as all parameters are of type string when fetched from Next.js.
     * Additionally, if further validation is needed, you can add another `.params` directly after the coerce one.
     */
    public params<T extends ZodRawShape>(schema: ZodObject<T>) {
        this.middlewares.push(async ({ params }) => {
            const parseResult = await schema.safeParseAsync(params);

            if (!parseResult.success) {
                let error;

                try {
                    error = formatZodError("Parameters", JSON.parse(parseResult.error.message));
                }
                catch {
                    error = parseResult.error.message;
                }

                return QualityApi.respond(StatusCode.BadRequest, { body: error });
            }

            this._params = parseResult.data;

            return QualityApi.next();
        });

        return this as EndpointBuilder<
            Authenticated,
            Body,
            z.infer<ZodObject<T>>,
            SearchParams
        >;
    }

    /**
     * Adds internal middleware that validates the request's search parameters (query parameters).
     *
     * @param schema Should mainly contain coerce fields, as all search parameters are of type string or string array when fetched from Next.js.
     * Additionally, if further validation is needed, you can add another `.params` directly after the coerce one.
     */
    public searchParams<T extends ZodRawShape>(schema: ZodObject<T>) {
        this.middlewares.push(async ({ searchParams }) => {
            const parseResult = await schema.safeParseAsync(searchParams);

            if (!parseResult.success) {
                let error;

                try {
                    error = formatZodError("Search parameters", JSON.parse(parseResult.error.message));
                }
                catch {
                    error = parseResult.error.message;
                }

                return QualityApi.respond(StatusCode.BadRequest, { body: error });
            }

            this._searchParams = parseResult.data;

            return QualityApi.next();
        });

        return this as EndpointBuilder<
            Authenticated,
            Body,
            Params,
            z.infer<ZodObject<T>>
        >;
    }

    /**
     * Defines the final function of the endpoint.
     * This returns a Next.js-endpoint-compatible function with all middleware compiled.
     */
    public endpoint<T extends ResponseBody>(fn: (data: Request<Authenticated, Body, Params, SearchParams>) => (Response | Promise<Response>)) {
        return async (nextRequest: globalThis.Request, context: { params: Promise<{}> }) => {
            this.user = await this.config.authentication?.authenticate(nextRequest) ?? null;

            if (nextRequest.method.toLowerCase() === "get")
                this._body = null;
            else {
                try {
                    this._body = await this.parseRequestBody(nextRequest);
                }
                catch {
                    return QualityApi.respond(StatusCode.UnsupportedMediaType);
                }
            }

            this._params = await context.params;
            this._searchParams = urlSearchParamsToObj(new URL(nextRequest.url).searchParams);

            for (const mw of this.middlewares) {
                const execution = await mw(this.getRequestData(nextRequest));

                if (execution instanceof Next) continue;

                testContentHeader(execution.headers);

                return execution;
            }

            const fnExec = await fn(this.getRequestData(nextRequest));

            testContentHeader(fnExec.headers);

            return fnExec;
        };
    }

}