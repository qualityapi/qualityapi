import { type Awaitable } from "./utils";
import { type User } from "./authentication";
import { type NextRequest } from "next/server";

export type Configuration = {

    /** The configuration of the out-of-the-box authentication system. */
    authentication?: {

        /**
         * Authenticates the user from the incoming request.
         *
         * This determines the `user` property of the request data when building an endpoint.
         *
         * Use module augmentation to mutate the `User` interface to fit your needs.
         */
        authenticate: (request: Request) => Awaitable<User | null>;

    };

    /**
     * The configuration of the out-of-the-box domain router.
     *
     * This works by mutating the `url` property of the incoming request, so that the server routes into the according domain in the `app` folder.
     *
     * Put your domains in the root of the `app` folder, and then your regular structure within this.
     *
     * Use the `QualityApi.DomainRouter.proxy` function in `proxy.ts` for this to work correctly.
     */
    domainRouter?: {

        /**
         * How Quality API should determine the domain/host of the incoming request.
         *
         * Is determined from the `Host` header by default, which is the recommended solution, thinking reverse proxies and testing purposes.
         */
        domainSelector?: (request: NextRequest) => Awaitable<string | null>;

        /**
         * How Quality API should reroute the incoming request based its domain and original pathname.
         *
         * If a falsy value is returned, the reroute won't happen at all.
         *
         */
        reroutePathname: (domain: string, originalPathname: string) => Awaitable<string | null>;

    };

};