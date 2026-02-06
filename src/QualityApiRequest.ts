import type { Session } from "next-auth";

export type QualityApiRequest<
    Authenticated extends boolean,
    Body = unknown,
    Params = unknown,
    SearchParams = unknown
> = {

    /**
     * If authenticated, the session of the authenticated user.
     *
     * This can be mutated through module augmentation. See [NextAuth module augmentation](https://next-auth.js.org/getting-started/typescript#module-augmentation).
     */
    session: Authenticated extends true ? Session : (Session | null);

    /** The request body. Use the `.body` middleware to validate this through your Zod schema. */
    body: Body;

    /** The request parameters (slugs). Use the `.params` middleware to validate this through your Zod schema. */
    params: Params;

    /** The request search parameters (query parameters). Use the `.searchParams` middleware to validate this through your Zod schema. */
    searchParams: SearchParams;

    /** The raw Next.js request. */
    _request: Request;

};