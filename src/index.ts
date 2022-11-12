import {promiseWrapper} from "./lib/composition.js";
import {ProcessQueue} from "./lib/ProcessQueue.js";

export function queueBuilder(fn: promiseFunc, timeout: number) {
    const wrappedPromise = promiseWrapper(fn)
    return function (taskRunner: promiseFunc) {

        const processQueue = new ProcessQueue(timeout, taskRunner)

        return (...args: any) => {
            processQueue.enQueue(wrappedPromise(...args))
            if (!processQueue.running) {
                processQueue.run()
            }
        }
    }
}

