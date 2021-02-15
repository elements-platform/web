export type ClientTransport<T> = {
    onmessage?: (data: T) => void
    send(data: T): Promise<void> | void
}

export type ClientEncoding<T> = {
    encode(data: { id: string, method: string, args: any[] }): T
    decode(data: T): { error: Error, id: string } | { result: any, id: string }
}

export type ClientEncodedTransport<T> = ClientTransport<T> & ClientEncoding<T>
