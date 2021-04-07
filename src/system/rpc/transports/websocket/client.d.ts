import { BaseTransport } from '../..'

export default function createTransport(
    url: string,
    onNextReconnectPeriod: (nextPeriod: number, reconnectImmidiately: () => void) => void,
    onReconnectCallback: (reconnect: () => Promise<void>) => void,
): BaseTransport<string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView>
