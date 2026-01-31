import type { User, Profile } from "next-auth";
import type { NextApiRequest } from "next";

type QualityApiRequest<
    Authorized extends boolean
> = {
    user: Authorized extends true ? User : (User | null);
    profile: Authorized extends true ? Profile : (Profile | null);
    _request: NextApiRequest
};

export default QualityApiRequest;