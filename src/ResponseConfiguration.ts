import { type ResponseBody } from "./ResponseBody";
import { type SameSite } from "./SameSite";

export type ResponseConfiguration = {

    /** The headers of the response. */
    headers?: Headers;

    /** A simplified way to apply `Set-Cookie` headers. */
    cookies?: {

        /** The actual name of the cookie. */
        name: string;

        /** The actual value of the cookie. */
        value: string;

        /** The scoped domain (and its subdomains) of the cookie. */
        domain?: string;

        /** The scoped path (and its sub-directories/-paths) of the cookie. */
        path?: string;

        /** The absolute lifetime of the cookie. */
        expires?: string | number | Date;

        /** The relative lifetime of the cookie. */
        maxAge?: string | number;

        /** Specifies that the cookie cannot be fetched via JavaScript, but still will be sent in requests. */
        httpOnly?: boolean;

        /** Specifies that the cookie is only sent in HTTPS requests, not HTTP (insecure) requests. */
        secure?: boolean;

        /** Specifies how strict the same-site policy of the cookie should be. */
        sameSite?: SameSite;

    }[];

    /** The body of the response. */
    body?: ResponseBody;

};