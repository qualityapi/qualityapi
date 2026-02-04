export function urlSearchParamsToObj(urlSearchParams: URLSearchParams) {
    let result: { [_: string]: any } = {};

    for (const key of urlSearchParams.keys()) {
        const value = urlSearchParams.getAll(key);

        switch (value.length) {
            case 0: break;

            case 1:
                result[key] = value[0];
                break;

            default: result[key] = value;
        }
    }

    return result;
}

export function formatZodError(step: string, error: { path: string[]; message: string; }[]) {
    try {
        return error.reduce((root, current) => ({
            ...root,
            properties: {
                ...root.properties,
                [current.path.join(".")]: current.message
            }
        }), { step, properties: {} });
    }
    catch {
        return error;
    }
}