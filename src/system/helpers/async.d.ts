/** Sleeps inside an async function for a specified time */
export function sleep(ms: number): Promise<void>

export class AsyncIteratorWithPeriodFunction<T>{
    constructor(next: () => { done: boolean, value: T }, period: (i: number) => number)
    [Symbol.asyncIterator](): {
        next(): Promise<{
            done: boolean
            value: {
                nextPeriod: number
                value: T
            }
        }>
    }
    resetCounter(): void
    awakeImmidiately(): void
}

export function createResolveablePromise<T>(): Promise<T> & {
    resolve: (value: T) => void
    reject: (reason: any) => void
}

/** Sets the function to be executed as fast as it can be after the next tick */
export function setImmediate<T extends any[]>(callback: (...args: T) => void, ...args: T): number

/** Clears execution handler set by `setImmediate` */
export function clearImmediate(handler: number): void
