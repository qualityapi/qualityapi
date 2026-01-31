import Middleware from "./QualityApiMiddleware.ts";

class QualityApiEndpointBuilder<
    Authorized extends boolean
> {

    private middlewares: Middleware<any>[] = [];

    public middleware(fn: Middleware<Authorized>) {
        this.middlewares.push(fn);

        return this;
    }

    public authorize() {
        this.middlewares.push(() => {});

        return this as QualityApiEndpointBuilder<true>;
    }

}

export default QualityApiEndpointBuilder;