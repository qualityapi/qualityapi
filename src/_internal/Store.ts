import { NextAuthResult } from "next-auth";

class NotSet {}

let nextAuth: NextAuthResult | NotSet = new NotSet();

namespace Store {

    function verify(variable: any, variableName: string) {
        if (variable instanceof NotSet) throw new Error(`Required variable "${variableName}" is not set!`);

        return true;
    }

    export namespace NextAuth {
        export function get() {
            verify(nextAuth, "nextAuth");

            return nextAuth as NextAuthResult;
        }

        export function set(value: NextAuthResult) {
            nextAuth = value;
        }
    }


}

export default Store;