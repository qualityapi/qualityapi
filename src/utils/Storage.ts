import { END_USER_STORAGE_NAMESPACE_KEY } from "../_internal/globals";

type StorageMap = Map<string, any>;

/**
 * Solution for in-memory, persistent storage.
 *
 * Primarily intended for database clients.
 */
export namespace Storage {

    function getMap() {
        if (!(END_USER_STORAGE_NAMESPACE_KEY in globalThis))
            // @ts-ignore
            globalThis[END_USER_STORAGE_NAMESPACE_KEY] =
                new Map<string, any>();

        // @ts-ignore
        return globalThis[END_USER_STORAGE_NAMESPACE_KEY] as StorageMap;
    }

    /** Get a value from the in-memory, persistent storage. */
    export function get<T>(key: string) {
        return getMap().get(key) as T;
    }

    /** Set a value in the in-memory, persistent storage. */
    export function set(key: string, value: any) {
        getMap().set(key, value);
    }

}