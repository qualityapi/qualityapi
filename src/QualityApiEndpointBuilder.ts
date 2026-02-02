import QualityApi from "./QualityApi";
import Store from "./_internal/./Store";

import { QualityApiResponse } from "./QualityApiResponse";
import { Continue } from "./Continue";
import { type QualityApiMiddleware as Middleware } from "./QualityApiMiddleware";
import { type QualityApiBody } from "./QualityApiBody";
import { type QualityApiRequest } from "./QualityApiRequest";
import { type NextAuthResult, type Session } from "next-auth";
import { formatZodError, urlSearchParamsToObj } from "./_internal/util-functions";

import z, { ZodObject, type ZodRawShape } from "zod";

export class QualityApiEndpointBuilder<
    Authenticated extends boolean = false,
    Body = unknown,
    Params = unknown,
    SearchParams = unknown
> {

    private middlewares: Middleware<any>[] = [];
    private session: Session | null = null;

    private _body: any = null;
    private _params: any = null;
    private _searchParams: any = null;

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
    public body<T extends ZodRawShape>(schema: ZodObject<T>) {
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
            z.infer<ZodObject<T>>,
            Params,
            SearchParams
        >;
    }

    /**
     * Adds internal middleware that validates the request's parameters (slugs).
     *
     * @param schema Should only contain coarce fields, as all parameters are of type string when fetched from Next.js. Additionally, if further validation is needed, you can add another `.params` directly after the coarce one.
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
     * @param schema Should mainly contain coarce fields, as all search parameters are of type string or string array when fetched from Next.js. Additionally, if further validation is needed, you can add another `.params` directly after the coarce one.
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

    /** Defines the final function of the endpoint. This returns a Next.js-endpoint-compatible function with all middleware compiled. */
    public endpoint<T extends QualityApiBody>(fn: (data: QualityApiRequest<Authenticated, Body, Params, SearchParams>) => QualityApiResponse<T> | Promise<QualityApiResponse<T>>) {
        return async (nextRequest: Request, context: { params: Promise<{}> }) => {
            this.session = await Store.get<NextAuthResult>("NextAuthConfig").auth();

            if (nextRequest.method.toLowerCase() === "get")
                this._body = null;
            else {
                try {
                    this._body = await nextRequest.json();
                }
                catch (error) {
                    return QualityApi.Respond._(415, { error: `${error}` }).toNextResponse();
                }
            }

            this._params = await context.params;
            this._searchParams = urlSearchParamsToObj(new URL(nextRequest.url).searchParams);

            for (const mw of this.middlewares) {
                const execution = await mw({
                    session: this.session,
                    body: this._body,
                    params: this._params,
                    searchParams: this._searchParams,
                    _request: nextRequest
                });

                if (!(execution instanceof Continue)) return execution.toNextResponse();
            }

            const execFn = await fn({
                session: this.session!,
                body: this._body,
                params: this._params,
                searchParams: this._searchParams,
                _request: nextRequest
            });

            return execFn.toNextResponse();
        };
    }

}