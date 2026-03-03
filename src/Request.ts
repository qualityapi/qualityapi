import { type Session } from "./authentication";

export type Request<
    Authenticated extends boolean,
    Body = unknown,
    Params = unknown,
    SearchParams = unknown
> = {

    /**
     * If authenticated, is set to the authenticated session.
     *
     * This can be mutated through module augmentation, and is `{}` by default.
     */
    session: Authenticated extends true ? Session : (Session | null);

    /** The request body. Use the `.body` middleware to validate this through your Zod schema. */
    body: Body;

    /** The request parameters (slugs). Use the `.params` middleware to validate this through your Zod schema. */
    params: Params;

    /**
     * The request search parameters (query parameters).
     *
     * Use the `.searchParams` middleware to validate this through your Zod schema.
     */
    searchParams: SearchParams;

    /** The raw Next.js request. */
    _request: globalThis.Request;

};