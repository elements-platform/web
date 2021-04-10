export {
    //@ts-ignore
    Error as NamedError
}

export function interceptErrors<F extends Function>(func: F): F
export function interceptErrorsAsync<F extends (...args: any[]) => Promise<any>>(func: F): F
