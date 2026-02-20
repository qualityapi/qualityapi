import { type ResponseBody } from "./ResponseBody";
import { type Responder } from "./Responder";

import stringifyResponseBody from "./_internal/util-functions/stringifyResponseBody";
import getBodyContentType from "./_internal/util-functions/getBodyContentType";

function generateResponder(code: number): Responder {
    return (body?: ResponseBody, contentType: string = getBodyContentType(body)) => {
        const response = new Response(stringifyResponseBody(body), { status: code });

        response.headers.set("Content-Type", contentType);

        return response;
    };
}

function generateResponderNoBody(code: number): Responder {
    return () => new Response(undefined, { status: code });
}

export const continue100 = generateResponder(100);
export const switchingProtocol101 = generateResponder(101);
export const processing102 = generateResponder(102);
export const earlyHints103 = generateResponder(103);

export const ok200 = generateResponder(200);
export const created201 = generateResponder(201);
export const accepted202 = generateResponder(202);
export const nonAuthoritativeInformation203 = generateResponder(203);
export const noContent204 = generateResponderNoBody(204);
export const resetContent205 = generateResponder(205);
export const partialContent206 = generateResponder(206);
export const multiStatus207 = generateResponder(207);
export const alreadyReported208 = generateResponder(208);
export const imUsed226 = generateResponder(226);

export const multipleChoices300 = generateResponder(300);
export const movedPermanently301 = generateResponder(301);
export const found302 = generateResponder(302);
export const seeOther303 = generateResponder(303);
export const notModified304 = generateResponder(304);
export const useProxy305 = generateResponder(305);
export const unused306 = generateResponder(306);
export const temporaryRedirect307 = generateResponder(307);
export const permanentRedirect308 = generateResponder(308);

export const badRequest400 = generateResponder(400);
export const unauthorized401 = generateResponder(401);
export const paymentRequired402 = generateResponder(402);
export const forbidden403 = generateResponder(403);
export const notFound404 = generateResponder(404);
export const methodNotAllowed405 = generateResponder(405);
export const notAcceptable406 = generateResponder(406);
export const proxyAuthenticationRequired407 = generateResponder(407);
export const requestTimeout408 = generateResponder(408);
export const conflict409 = generateResponder(409);
export const gone410 = generateResponder(410);
export const lengthRequired411 = generateResponder(411);
export const preconditionFailed412 = generateResponder(412);
export const requestEntityTooLarge413 = generateResponder(413);
export const requestURITooLong414 = generateResponder(414);
export const unsupportedMediaType415 = generateResponder(415);
export const requestedRangeNotSatisfiable416 = generateResponder(416);
export const expectationFailed417 = generateResponder(417);
export const imATeapot418 = generateResponder(418);
export const enhanceYourCalm420 = generateResponder(420);
export const unprocessableEntity422 = generateResponder(422);
export const locked423 = generateResponder(423);
export const failedDependency424 = generateResponder(424);
export const tooEarly425 = generateResponder(425);
export const upgradeRequired426 = generateResponder(426);
export const preconditionRequired428 = generateResponder(428);
export const tooManyRequests429 = generateResponder(429);
export const requestHeaderFieldsTooLarge431 = generateResponder(431);
export const noResponse444 = generateResponder(444);
export const retryWith449 = generateResponder(449);
export const blockedByWindowsParentalControls450 = generateResponder(450);
export const unavailableForLegalReasons451 = generateResponder(451);
export const clientClosedRequest499 = generateResponder(499);

export const internalServerError500 = generateResponder(500);
export const notImplemented501 = generateResponder(501);
export const badGateway502 = generateResponder(502);
export const serviceUnavailable503 = generateResponder(503);
export const gatewayTimeout504 = generateResponder(504);
export const hTTPVersionNotSupported505 = generateResponder(505);
export const variantAlsoNegotiates506 = generateResponder(506);
export const insufficientStorage507 = generateResponder(507);
export const loopDetected508 = generateResponder(508);
export const notExtended510 = generateResponder(510);
export const networkAuthenticationRequired511 = generateResponder(511);