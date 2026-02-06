import QualityApi from "./QualityApi";
import Store from "./_internal/./Store";

import { Continue } from "./Continue";
import { type QualityApiMiddleware as Middleware } from "./QualityApiMiddleware";
import { type QualityApiBody } from "./QualityApiBody";
import { type QualityApiRequest } from "./QualityApiRequest";
import { type NextAuthResult, type Session } from "next-auth";
import { formatZodError, testContentHeader, urlSearchParamsToObj } from "./_internal/util-functions";
import { QualityApiRequestContentType as ContentType } from "./QualityApiContentType";

import z, { ZodObject, type ZodRawShape, type ZodType } from "zod";

export class QualityApiEndpointBuilder<
    Authenticated extends boolean,
    Body,
    Params,
    SearchParams
> {

    private middlewares: Middleware<any>[] = [];
    private session: Session | null = null;

    private _body: any = null;
    private _params: any = null;
    private _searchParams: any = null;

    private _contentType: ContentType;

    constructor(contentType: ContentType) {
        this._contentType = contentType;
    }

    private getRequestData(nextRequest: Request): QualityApiRequest<Authenticated, Body, Params, SearchParams> {
        return {
            session: this.session!,
            body: this._body,
            params: this._params,
            searchParams: this._searchParams,
            _request: nextRequest
        };
    }

    private async parseRequestBody(request: Request) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                switch (this._contentType) {
                    case ContentType.JSON: return resolve(await request.json());
                    case ContentType.Blob: return resolve(await request.blob());
                    case ContentType.Bytes: return resolve(await request.bytes());
                    case ContentType.Text: return resolve(await request.text());
                    case ContentType.ArrayBuffer: return resolve(await request.arrayBuffer());
                    case ContentType.FormData: return resolve(await request.formData());
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
        this.middlewares.push(async () => {
            if (!this.session) return QualityApi.Respond.unauthorized();

            return new Continue();
        });

        return this as QualityApiEndpointBuilder<
            true,
            Body,
            Params,
            SearchParams
        >;
    }

    /** Adds internal middleware that validates the request body. */
    public body<T extends ZodType>(schema: T) {
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

                return QualityApi.Respond.badRequest(error);
            }

            this._body = parseResult.data;

            return new Continue();
        });

        return this as QualityApiEndpointBuilder<
            Authenticated,
            z.infer<T>,
            Params,
            SearchParams
        >;
    }

    /**
     * Adds internal middleware that validates the request's parameters (slugs).
     *
     * @param schema Should only contain coerce fields, as all parameters are of type string when fetched from Next.js. Additionally, if further validation is needed, you can add another `.params` directly after the coarce one.
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


                return QualityApi.Respond.badRequest(error);
            }

            this._params = parseResult.data;

            return new Continue();
        });

        return this as QualityApiEndpointBuilder<
            Authenticated,
            Body,
            z.infer<ZodObject<T>>,
            SearchParams
        >;
    }

    /**
     * Adds internal middleware that validates the request's search parameters (query parameters).
     *
     * @param schema Should mainly contain coerce fields, as all search parameters are of type string or string array when fetched from Next.js. Additionally, if further validation is needed, you can add another `.params` directly after the coarce one.
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

                return QualityApi.Respond.badRequest(error);
            }

            this._searchParams = parseResult.data;

            return new Continue();
        });

        return this as QualityApiEndpointBuilder<
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
    public endpoint<T extends QualityApiBody>(fn: (data: QualityApiRequest<Authenticated, Body, Params, SearchParams>) => (Response | Promise<Response>)) {
        return async (nextRequest: Request, context: { params: Promise<{}> }) => {
            this.session = await Store.get<NextAuthResult>("NextAuthConfig").auth();

            if (nextRequest.method.toLowerCase() === "get")
                this._body = null;
            else {
                try {
                    this._body = await this.parseRequestBody(nextRequest);
                }
                catch {
                    return QualityApi.Respond._(415);
                }
            }

            this._params = await context.params;
            this._searchParams = urlSearchParamsToObj(new URL(nextRequest.url).searchParams);

            for (const mw of this.middlewares) {
                const execution = await mw(this.getRequestData(nextRequest));

                if (execution instanceof Continue) continue;

                testContentHeader(execution.headers);

                return execution;
            }

            const fnExec = await fn(this.getRequestData(nextRequest));

            testContentHeader(fnExec.headers);

            return fnExec;
        };
    }

}