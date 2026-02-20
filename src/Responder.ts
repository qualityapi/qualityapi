import type { ResponseBody } from "./ResponseBody";

export type Responder = (body?: ResponseBody, contentType?: string) => Response;