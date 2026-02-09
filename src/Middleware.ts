import { Next } from "./Next";
import { type Request } from "./Request";

export type Middleware<Authenticated extends boolean> =
    (data: Request<Authenticated>) =>
        Response |
        Promise<Response> |
        Next;