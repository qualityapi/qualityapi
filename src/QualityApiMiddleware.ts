import QualityApiResponse from "./QualityApiResponse.ts";
import QualityApiRequest from "./QualityApiRequest.ts";

type QualityApiMiddleware<Authorized extends boolean> = (data: QualityApiRequest<Authorized>) => QualityApiResponse<any> | void;

export default QualityApiMiddleware;