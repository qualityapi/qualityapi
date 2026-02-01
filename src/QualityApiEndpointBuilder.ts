import Middleware from "./QualityApiMiddleware.ts";
import QualityApi from "./QualityApi.ts";
import QualityApiResponse from "./QualityApiResponse.ts";
import QualityApiBody from "./QualityApiBody.ts";
import QualityApiRequest from "./QualityApiRequest.ts";
import Store from "./_internal/Store.ts";
import Continue from "./Continue.ts";

import { Session } from "next-auth";
import z, { ZodObject, ZodRawShape } from "zod";

class QualityApiEndpointBuilder<
    Authorized extends boolean,
    Body = unknown,
    Params = unknown,
    SearchParams = unknown
> {

    private middlewares: Middleware<any>[] = [];
    private session: Session | null = null;

    private _body: any = null;
    private _params: any = null;
    private _searchParams: any = null;

    public middleware(fn: Middleware<Authorized>) {
        this.middlewares.push(fn);

        return this;
    }

    public authorize() {
        this.middlewares.push(async () => {
            const session = await Store.NextAuth.get().auth();

            if (!session) {
                this.session = null;

                return QualityApi.Responses.unauthorized();
            }

            this.session = session;

            return new Continue();
        });

        return this as QualityApiEndpointBuilder<
            true,
            Body,
            Params,
            SearchParams
        >;
    }

    public body<T extends ZodRawShape>(schema: ZodObject<T>) {
        this.middlewares.push(async ({ body }) => {
            const parseResult = await schema.safeParseAsync(body);

            if (!parseResult.success) {
                let error;

                try {
                    error = JSON.parse(parseResult.error.message);
                }
                catch {
                    error = parseResult.error.message;
                }

                return QualityApi.Responses.badRequest(error);
            }

            this._body = parseResult.data;
        });

        return this as QualityApiEndpointBuilder<
            Authorized,
            z.infer<T>,
            Params,
            SearchParams
        >;
    }

    public params<T extends ZodRawShape>(schema: ZodObject<T>) {
        this.middlewares.push(async ({ params }) => {
            const parseResult = await schema.safeParseAsync(params);

            if (!parseResult.success) {
                let error;

                try {
                    error = JSON.parse(parseResult.error.message);
                }
                catch {
                    error = parseResult.error.message;
                }


                return QualityApi.Responses.badRequest(error);
            }

            this._params = parseResult.data;
        });

        return this as QualityApiEndpointBuilder<
            Authorized,
            Body,
            z.infer<T>,
            SearchParams
        >;
    }

    public searchParams<T extends ZodRawShape>(schema: ZodObject<T>) {
        this.middlewares.push(async ({ searchParams }) => {
            const parseResult = await schema.safeParseAsync(searchParams);

            if (!parseResult.success) {
                let error;

                try {
                    error = JSON.parse(parseResult.error.message);
                }
                catch {
                    error = parseResult.error.message;
                }

                return QualityApi.Responses.badRequest(error);
            }

            this._searchParams = parseResult.data;
        });

        return this as QualityApiEndpointBuilder<
            Authorized,
            Body,
            Params,
            z.infer<T>
        >;
    }

    public endpoint<T extends QualityApiBody>(fn: (data: QualityApiRequest<Authorized, Body, Params, SearchParams>) => QualityApiResponse<T>) {
        return async (nextRequest: Request, context: { params: {} }) => {
            try {
                this._body = nextRequest.json();
            }
            catch {
                return QualityApi.Responses._(415);
            }

            this._params = context.params;
            this._searchParams = new URL(nextRequest.url).searchParams.entries();

            for (const mw of this.middlewares) {
                const execution = await mw({
                    session: this.session,
                    body: this._body,
                    params: this._params,
                    searchParams: this._searchParams,
                    _request: nextRequest
                });

                if (!(execution instanceof Continue)) return execution;
            }

            return fn({
                session: this.session!,
                body: this._body,
                params: this._params,
                searchParams: this._searchParams,
                _request: nextRequest
            });
        };
    }

}

export default QualityApiEndpointBuilder;