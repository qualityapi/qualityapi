export namespace Logger {

    export function success(msg: string) {
        console.log(`✅ Quality API: ${msg}`);
    }

    export function error(msg: string) {
        console.error(`❌ Quality API: ${msg}`);
    }

    export function warn(msg: string) {
        console.warn(`⚠️ Quality API: ${msg}`);
    }

}