export class QualityApiError extends Error {
    constructor(msg: string) {
        super(`❌ Quality API: ${msg}`);
    }
}