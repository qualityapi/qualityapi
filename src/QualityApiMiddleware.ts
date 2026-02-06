import { Continue } from "./Continue";
import { type QualityApiRequest } from "./QualityApiRequest";

export type QualityApiMiddleware<Authenticated extends boolean> =
    (data: QualityApiRequest<Authenticated>) =>
        Response |
        Promise<Response> |
        Continue;
