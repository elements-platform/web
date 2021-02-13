type API = {
    [method: string]: (...args: any[]) => Promise<any>
}

declare const API: {
    new(): API
    prototype: API
}

export default API

export function registerAction(moduleUrl: string, name: string, callback: (...args: any[]) => any): void

export function unregisterActions(moduleUrl: string): void

export function getApiUrl(): Promise<string>

export class APICallOptions{
    constructor(options: {
        silent?: boolean
    })
}
