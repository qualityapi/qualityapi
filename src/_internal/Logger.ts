export namespace Logger {

    export function warn(msg: string) {
        console.warn(`⚠️ Quality API: ${msg}`);
    }

    export function process(msg: string) {
        console.log(`🔃 Quality API: ${msg}`);
    }

    export function success(msg: string) {
        console.log(`✅ Quality API: ${msg}`);
    }

}