import { GLOBALTHIS_NAMESPACE } from "./globals";

namespace InternalStore {

    function init() {
        if (!(GLOBALTHIS_NAMESPACE in globalThis))
            // @ts-ignore
            globalThis[GLOBALTHIS_NAMESPACE] = new Map<string, any>();
    }

    export function get<T>(key: string) {
        init();

        // @ts-ignore
        return globalThis[GLOBALTHIS_NAMESPACE].get(key) as T;
    }

    export function set(key: string, value: any) {
        init();

        // @ts-ignore
        return globalThis[GLOBALTHIS_NAMESPACE].set(key, value);
    }

}

export default InternalStore;