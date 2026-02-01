const KEY = "__QUALITYAPI__";

namespace Store {

    function init() {
        if (!(KEY in globalThis))
            // @ts-ignore
            globalThis[KEY] = new Map<string, any>();
    }

    export function get<T>(key: string) {
        init();

        // @ts-ignore
        return globalThis[KEY].get(key);
    }

    export function set(key: string, value: any) {
        init();

        // @ts-ignore
        return globalThis[KEY].set(key, value);
    }

}

export default Store;