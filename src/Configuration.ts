import { type SameSite } from "./SameSite";
import { type JWT } from "./JWT";
import { type User } from "./User";

export type Configuration = {

    /** The configuration of the out-of-the-box authentication system. */
    authentication?: {

        /** The secret used to encrypt JWTs. */
        secret: string;

        cookie: {
            httpOnly: boolean;
            secure: boolean;
            sameSite: SameSite;
            maxAge: number;
        };

        /** The factory function to get the user from the given JWT. */
        getUser: (jwt: JWT) => User | Promise<User>;

    }

};