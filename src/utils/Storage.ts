import { END_USER_STORAGE_NAMESPACE_KEY } from "../_internal/globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StorageMap = Map<string, any>;

/**
 * Solution for in-memory, persistent storage.
 *
 * Primarily intended for database clients.
 */
export namespace Storage {

    function getMap() {
        if (!(END_USER_STORAGE_NAMESPACE_KEY in globalThis))
            // @ts-expect-error To suppress `globalThis` throwing error when setting custom property
            globalThis[END_USER_STORAGE_NAMESPACE_KEY] =
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                new Map<string, any>();

        // @ts-expect-error To suppress `globalThis` throwing error when setting custom property
        return globalThis[END_USER_STORAGE_NAMESPACE_KEY] as StorageMap;
    }

    /** Get a value from the in-memory, persistent storage. */
    export function get<T>(key: string) {
        return getMap().get(key) as T;
    }

    /** Set a value in the in-memory, persistent storage. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function set(key: string, value: any) {
        getMap().set(key, value);
    }

}