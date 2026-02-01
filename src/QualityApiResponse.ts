import { type QualityApiBody } from "./QualityApiBody";

export class QualityApiResponse<Body extends QualityApiBody> {

    public readonly status: number;
    public readonly body: Body | undefined;

    constructor(_status: number, _body?: Body) {
        this.status = _status;
        this.body = _body;
    }

    public toNextResponse() {
        return (
            this.status === 204
                ? new Response(undefined, { status: this.status })
                : Response.json(this.body ?? {}, { status: this.status })
        );
    }

}