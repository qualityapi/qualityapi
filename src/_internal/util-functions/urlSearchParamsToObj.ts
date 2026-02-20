function urlSearchParamsToObj(urlSearchParams: URLSearchParams) {
    const result: { [_: string]: unknown } = {};

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

export default urlSearchParamsToObj;