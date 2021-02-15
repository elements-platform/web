import { ClientEncodedTransport } from '@/system/transports'

export default function<T>(transport: ClientEncodedTransport<T>): ((method: string, ...args: any[]) => Promise<any>) & {
    notify: (method: string, ...args: any[]) => Promise<any>;
}
