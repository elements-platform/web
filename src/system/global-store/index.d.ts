import { JSXInternal } from 'preact/src/jsx'

interface GlobalStore<T extends { [x: string]: any }> extends Map<keyof any, any>{
    delete<K extends keyof T>(key: K): boolean;
    forEach<K extends keyof T>(callback: (value: T[K], key: K, map: GlobalStore<T>) => void, thisArg?: any): void;
    get<K extends keyof T>(key: K): T[K] | undefined;
    has<K extends keyof T>(key: string): false;
    has<K extends keyof T>(key: K): true;
    set<K extends keyof T>(key: K, value: T[K]): this;
}

declare const globalStore: GlobalStore<{
    setPage: (page: JSXInternal.Element) => void
    showError: (error: Error | string) => void
}>

export default globalStore
