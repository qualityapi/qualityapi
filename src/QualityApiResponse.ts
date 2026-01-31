import QualityApiBody from "./QualityApiBody.ts";

class QualityApiResponse<Body extends QualityApiBody> {

    public readonly status: number;
    public readonly body: Body | undefined;

    constructor(_status: number, _body?: Body) {
        this.status = _status;
        this.body = _body;
    }

}

export default QualityApiResponse;