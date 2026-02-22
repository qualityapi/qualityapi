import { type NextRequest, NextResponse } from "next/server";
import { type Configuration } from "../Configuration";
import { Logger } from "../_internal/Logger";
import { CONFIGURATION_STORE_KEY } from "../_internal/globals";

import InternalStore from "../_internal/InternalStore";

/** Contains relevant tools to the domain router module. */
namespace DomainRouter {

    /**
     * Works with the Next.js proxy so that the domain router works correctly.
     *
     * This should be returned at the end of the `proxy` function in `proxy.ts`.
     *
     * @param request The request parameter of the `proxy` function in `proxy.ts`.
     * @param defaultResponse The value to return if the proxy doesn't reroute. Is `NextResponse.next()` by default.
     */
    export async function proxy(request: NextRequest, defaultResponse: NextResponse = NextResponse.next()) {
        const config = InternalStore.get<Configuration>(CONFIGURATION_STORE_KEY);

        if (!config.domainRouter) {
            Logger.warn("Domain router is not correctly configured!");

            return defaultResponse;
        }

        const domain =
            config.domainRouter.domainSelector
                ? await config.domainRouter.domainSelector(request)
                : request.headers.get("Host");

        if (!domain) return defaultResponse;

        const pathname = await config.domainRouter.reroutePathname(domain, request.nextUrl.pathname);

        if (!pathname) return defaultResponse;

        return NextResponse.rewrite(new URL(pathname, request.url));
    }

}

export default DomainRouter;