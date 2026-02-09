import { type Configuration } from "../../Configuration";

import jwt from "jsonwebtoken";

async function getUserFromHeaders(
    headers: Headers,
    secret: string,
    getUserFromJwt: NonNullable<Configuration["authentication"]>["getUser"]
) {
    const header = headers.get("Cookie");

    if (!header) return null;

    const split = header.split("=");

    if (split[0] !== "jwt") return null;

    const token = split.splice(1).join("=");

    try {
        const verification = jwt.verify(token, secret);

        return await getUserFromJwt(verification);
    }
    catch {
        return null;
    }
}

export default getUserFromHeaders;