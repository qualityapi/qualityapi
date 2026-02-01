import type { Session } from "next-auth";

type QualityApiRequest<
    Authorized extends boolean,
    Body = unknown,
    Params = unknown,
    SearchParams = unknown
> = {
    session: Authorized extends true ? Session : (Session | null);
    body: Body;
    params: Params;
    searchParams: SearchParams;
    _request: Request
};

export default QualityApiRequest;