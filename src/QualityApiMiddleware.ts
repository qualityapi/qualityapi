import { QualityApiResponse } from "./QualityApiResponse";
import { Continue } from "./Continue";
import { type QualityApiRequest } from "./QualityApiRequest";

export type QualityApiMiddleware<Authorized extends boolean> =
    (data: QualityApiRequest<Authorized>) => (
        QualityApiResponse<any> |
        Promise<QualityApiResponse<any>> |
        Continue
    );
