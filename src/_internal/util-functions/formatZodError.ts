function formatZodError(step: string, error: { path: string[]; message: string; }[]) {
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

export default formatZodError;