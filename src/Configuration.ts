import { type SameSite, type JWT, type User } from "./auth";
import { type QueryResult, type SqlMigration } from "./database";
import { type Algorithm } from "jsonwebtoken";

export type Configuration = {

    /** The configuration of the out-of-the-box authentication system. */
    authentication?: {

        /**
         * The secret used to encrypt and validate JWTs.
         *
         * This should _not_ be hard-coded, but rather put in an environment variable.
         *
         * @see [Node.js | Environment variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
         */
        secret: string;

        /**
         * How the JWTs should be configured.
         *
         * @see [JWT Debugger | Introduction to JSON Web Tokens](https://www.jwt.io/introduction)
         */
        jwt: {

            /**
             * The algorithm used to sign the JWTs.
             *
             * @default HS512
             */
            algorithm?: Exclude<Algorithm, "none">;

            /**
             * The lifetime of the JWT in seconds.
             *
             * If the backend receives an expired JWT, it is deemed as invalid.
             */
            lifetime: number;

        };

        /** How the cookies should be configured. */
        cookie: {

            /**
             * Whether or not the `HttpOnly` flag should be included in the cookie.
             *
             * When this is enabled, it prevents JavaScript from fetching the cookie - only the server and the browser itself can access it.
             */
            httpOnly: boolean;

            /**
             * Whether or not the `Secure` flag should be included in the cookie.
             *
             * When this is enabled, the cookie will _only_ be sent from the frontend if the protocol is secure (`https`).
             *
             * This is _required_ when `sameSite` is set to `None`;
             */
            secure: boolean;

            /**
             * The security level of the cookie regarding cross-site requests.
             *
             * **Strict:** The cookie is _only_ sent for same-site requests.
             *
             * **Lax:** The cookie is sent for same-site requests, as well as top-level navigation with safe methods.
             *
             * **None:** The cookie is sent for all requests - both same-site and cross-site. This _requires_ the `Secure` flag.
             */
            sameSite: SameSite;

            /**
             * The lifetime of the cookie in seconds.
             *
             * When the cookie expires after this timespan, it is automatically deleted by the browser.
             */
            maxAge: number;
        };

        /**
         * The factory function to get the user from the given JWT.
         *
         * When a valid JWT is received from the frontend, and validated, this function is run, which then sets the `user` parameter in the request data.
         */
        getUser: (jwt: JWT) => User | Promise<User>;

    };

    /**
     * The configuration of the out-of-the-box SQL database system.
     *
     * As of today, this is only intended for SQL databases, but other databases can be used through other solutions.
     */
    database?: {

        /**
         * The name of the database table to contain the already applied SQL migrations.
         *
         * @default qualityapi__applied_migrations
         */
        appliedMigrationsTableName?: string;

        /**
         * The function to execute the initializing SQL script in the database.
         *
         * This is intended to create a table for the applied migrations if it doesn't already exist.
         */
        executeInitSql: () => void | Promise<void>;

        /**
         * The function to get the unapplied SQL migrations (in chronological order).
         *
         * This should compare the total migrations to the already applied migrations stored in the database.
         */
        getUnappliedMigrations: () => SqlMigration[] | Promise<SqlMigration[]>;

        /**
         * The function to execute the SQL query, and return the results.
         *
         * The `bindingParams` parameter should be used here to prevent SQL injections.
         */
        query: <Row>(sql: string, bindingParams: any[]) => QueryResult<Row> | Promise<QueryResult<Row>>;

    };

};