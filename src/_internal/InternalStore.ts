import { GLOBALTHIS_NAMESPACE } from "./globals";

namespace InternalStore {

    function init() {
        if (!(GLOBALTHIS_NAMESPACE in globalThis))
            // @ts-expect-error To suppress `globalThis` throwing error when setting custom property
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            globalThis[GLOBALTHIS_NAMESPACE] = new Map<string, any>();
    }

    export function get<T>(key: string) {
        init();

        // @ts-expect-error To suppress `globalThis` throwing error when setting custom property
        return globalThis[GLOBALTHIS_NAMESPACE].get(key) as T;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function set(key: string, value: any) {
        init();

        // @ts-expect-error To suppress `globalThis` throwing error when setting custom property
        return globalThis[GLOBALTHIS_NAMESPACE].set(key, value);
    }

}

export default InternalStore;