import { type NextAuthResult } from "next-auth";

export type QualityApiConfig = {

    /** The initialized NextAuth configuration. This is returned from invoking the `NextAuth` method from the `"next-auth"` package. */
    nextAuth: NextAuthResult;

};