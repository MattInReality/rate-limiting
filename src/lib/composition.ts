
export const composeTaskRunner = (success: unknownFunc, errorHandler: unknownFunc) => {
    return function (task: promiseFunc) {
        return task().then(success).catch(errorHandler)
    }
} // Composition wrapper.
export const promiseWrapper = (fn: promiseFunc) => {
    return function (...args: any): promiseFunc {
        return () => fn(...args)
    }
}