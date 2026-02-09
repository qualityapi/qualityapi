import { type JWT } from "./JWT";
import { type ResponseBody } from "./ResponseBody";
import { type Configuration } from "./Configuration";
import { getBodyContentType } from "./_internal/util-functions";
import { Logger } from "./_internal/Logger";
import { CONFIGURATION_STORE_KEY } from "./_internal/globals";

import jwtpkg from "jsonwebtoken";
import Store from "./_internal/Store";

/** Contains the most commonly used HTTP response codes. Use `_` function to define your own. */
export namespace Respond {

    function generate(statusCode: number) {
        return <Body extends ResponseBody>(
            body?: Body,
            contentType: string = getBodyContentType(body),
            jwt?: JWT
        ) => _<Body>(
            statusCode,
            body,
            contentType,
            jwt
        );
    }

    function generateNoBody(statusCode: number) {
        return () => _(statusCode);
    }


    /** 200 OK */
    export const ok = generate(200);

    /** 201 Created */
    export const created = generate(201);

    /** 202 Accepted */
    export const accepted = generate(202);

    /** 204 No content */
    export const noContent = generateNoBody(204);

    /** 400 Bad request */
    export const badRequest = generate(400);

    /** 401 Unauthorized */
    export const unauthorized = generate(401);

    /** 403 Forbidden */
    export const forbidden = generate(403);

    /** 404 Not found */
    export const notFound = generate(404);

    /** 409 Conflict */
    export const conflict = generate(400);

    /** 500 Internal server error */
    export const internalServerError = generate(500);


    // Other

    /** Creates a response outside of the predefined HTTP codes. */
    export function _<Body extends ResponseBody>(
        status: number,
        body?: Body,
        contentType: string = getBodyContentType(body),
        jwt?: JWT
    ) {
        const config = Store.get<Configuration>(CONFIGURATION_STORE_KEY);

        const isBlob = body instanceof Blob;
        const isString = typeof body === "string";

        const isJson =
            !isBlob &&
            !isString;

        const response =
            new Response(
                isJson ? JSON.stringify(body) : body,
                { status }
            );

        response.headers.set("Content-Type", contentType);

        if (jwt) {
            if (config.authentication) {
                const token = jwtpkg.sign(jwt, config.authentication.secret, {
                    algorithm: config.authentication.jwt.algorithm ?? "HS512",
                    expiresIn: config.authentication.jwt.lifetime
                });

                response.headers.append("Set-Cookie", [
                    `jwt=${token};`,
                    `SameSite=${config.authentication.cookie.sameSite};`,
                    `Max-Age=${config.authentication.cookie.maxAge};`,
                    "Path=/;",
                    config.authentication.cookie.secure ? "Secure;" : "",
                    config.authentication.cookie.httpOnly ? "HttpOnly;" : ""
                ].filter(Boolean).join(" "));
            }
            else Logger.warn("JWT is provided, but authentication is not configured!");
        }

        return response;
    }

}