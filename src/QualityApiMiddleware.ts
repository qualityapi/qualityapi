import QualityApiResponse from "./QualityApiResponse.ts";
import QualityApiRequest from "./QualityApiRequest.ts";
import Continue from "./Continue.ts";

type QualityApiMiddleware<Authorized extends boolean> =
    (data: QualityApiRequest<Authorized>) =>
        QualityApiResponse<any> |
        Promise<QualityApiResponse<any>> |
        Continue;

export default QualityApiMiddleware;