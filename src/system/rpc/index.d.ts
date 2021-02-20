import { FunctionArgs } from '@/@typings/helpers'

export type BaseTransport<T> = {
    onmessage?: (data: T) => void
    send(data: T): Promise<void> | void
}

export type ServerTransport<T> = BaseTransport<T> & {
    call(method: string, args: any[], callback: (error: Error, result: any) => void): void
}

export type ClientEncoding<T> = {
    encode(data: { id: string, method: string, args: any[] }): T
    decode(data: T): { id: string } & ({ result: any, error?: undefined | null } | { error: Error, result?: undefined })
}

export type ServerEncoding<T> = {
    encode(data: ReturnType<ClientEncoding<T>['decode']> ): FunctionArgs<ClientEncoding<T>['decode']>[0]
    decode(data: ReturnType<ClientEncoding<T>['encode']> ): FunctionArgs<ClientEncoding<T>['encode']>[0]
}

export type ClientEncodedTransport<T> = BaseTransport<T> & ClientEncoding<T>

export type ServerEncodedTransport<T> = ServerTransport<T> & ServerEncoding<T>
