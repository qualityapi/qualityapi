import { type Awaitable } from "./_internal/Awaitable";
import { type User } from "./User";

export type Configuration = {

    /** The configuration of the out-of-the-box authentication system. */
    authentication?: {

        /** Authenticates the received request. */
        authenticate: (request: Request) => Awaitable<User | null>;

    };

};