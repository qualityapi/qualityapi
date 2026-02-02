import { QualityApiResponse } from "./QualityApiResponse";
import { Continue } from "./Continue";
import { type QualityApiRequest } from "./QualityApiRequest";

export type QualityApiMiddleware<Authenticated extends boolean> =
    (data: QualityApiRequest<Authenticated>) => (
        QualityApiResponse<any> |
        Promise<QualityApiResponse<any>> |
        Continue
    );
