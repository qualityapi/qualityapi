export namespace Casing {

    const SNAKE_CASE_REGEX = /[a-z]_[a-z]/g;
    const KEBAB_CASE_REGEX = /[a-z]-[a-z]/g;
    const CAMEL_PASCAL_CASE_REGEX = /[a-z][A-Z]/g;

    function _toCamelCase(text: string) {
        const snakeCasePoints = SNAKE_CASE_REGEX.exec(text)?.length ?? 0;

        const kebabCasePoints = KEBAB_CASE_REGEX.exec(text)?.length ?? 0;

        const camelCasePoints =
            (CAMEL_PASCAL_CASE_REGEX.exec(text)?.length ?? 0) +
            (/[a-z]/.test(text.split("")[0]) ? 1 : 0);

        const pascalCasePoints =
            (CAMEL_PASCAL_CASE_REGEX.exec(text)?.length ?? 0) +
            (/[A-Z]/.test(text.split("")[0]) ? 1 : 0);

        const highest = Math.max(snakeCasePoints, kebabCasePoints, camelCasePoints, pascalCasePoints);

        const split = text.split("");

        let result = `${split[0].toLowerCase()}${split.splice(1).join("")}`;

        switch (highest) {
            case (snakeCasePoints):
                return result.replace(SNAKE_CASE_REGEX, ss => {
                    const [a, _, b] = ss.split("");

                    return `${a.toLowerCase()}${b.toUpperCase()}`;
                });

            case (kebabCasePoints):
                return result.replace(KEBAB_CASE_REGEX, ss => {
                    const [a, _, b] = ss.split("");

                    return `${a.toLowerCase()}${b.toUpperCase()}`;
                });

            case (camelCasePoints):
            case (pascalCasePoints):
                return result;
        }
    }

    export function toCamelCase<T extends string | {} | []>(item: T): T {
        if (typeof item === "string")
            return _toCamelCase(item) as T;
        else if (Array.isArray(item)) {
            return item.map(i =>
                !!i &&
                !Array.isArray(i) &&
                typeof i === "object"
                    ? _toCamelCase(i)
                    : i
            ) as T;
        }
        else {
            let result = {};

            const entries = Object.entries(item);

            for (const [key, value] of entries) {
                result = {
                    ...result,
                    [`${_toCamelCase(key)}`]:
                        !!value &&
                        !Array.isArray(value) &&
                        typeof value === "object"
                            ? _toCamelCase(value)
                            : value
                }
            }

            return result as T;
        }
    }

}