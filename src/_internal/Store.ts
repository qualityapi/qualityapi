import { GLOBAL_THIS_NAMESPACE } from "./globals";

namespace Store {

    function init() {
        if (!(GLOBAL_THIS_NAMESPACE in globalThis))
            // @ts-ignore
            globalThis[GLOBAL_THIS_NAMESPACE] = new Map<string, any>();
    }

    export function get<T>(key: string) {
        init();

        // @ts-ignore
        return globalThis[GLOBAL_THIS_NAMESPACE].get(key) as T;
    }

    export function set(key: string, value: any) {
        init();

        // @ts-ignore
        return globalThis[GLOBAL_THIS_NAMESPACE].set(key, value);
    }

}

export default Store;