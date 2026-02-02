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

    /** The request body. */
    body: Body;

    /** The request parameters (slugs). */
    params: Params;

    /** The request search parameters (query parameters). */
    searchParams: SearchParams;

    /** The raw Next.js request. */
    _request: Request;

};