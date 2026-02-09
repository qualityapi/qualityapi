import InternalStore from "../_internal/InternalStore";

import { type Configuration } from "../Configuration";
import { CONFIGURATION_STORE_KEY } from "../_internal/globals";
import { QualityApiError } from "../QualityApiError";

namespace QualityApiDb {

    /** Performs a query in your database. */
    export async function query<Row>(sql: string, bindingParams: any[] = []) {
        const config = InternalStore.get<Configuration>(CONFIGURATION_STORE_KEY);

        if (!config.database) throw new QualityApiError("Database is not configured!");

        try {
            return config.database.query<Row>(sql, bindingParams);
        }
        catch (error) {
            throw new QualityApiError(`SQL query could not be executed!\n${error}`);
        }
    }

    /** Applies the given, unapplied SQL migrations to the database. */
    export async function applyMigrations() {
        const config = InternalStore.get<Configuration>(CONFIGURATION_STORE_KEY);

        if (!config.database) throw new QualityApiError("Database is not configured!");

        try {
            await config.database.executeInitSql();
        }
        catch (error) {
            throw new QualityApiError(`Could not execute initializing SQL script!\n${error}`);
        }
    }

}

export default QualityApiDb;