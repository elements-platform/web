import { ClientEncodedTransport } from '@/system/rpc'

// @ts-ignore
declare function callRPCMethod(method: string, ...args: [...any[], (error: Error, result: any) => void]): void
declare function callRPCMethod(method: string, ...args: any[]): Promise<any>

export default function createRPCClient<T>(transport: ClientEncodedTransport<T>): typeof callRPCMethod & {
    notify(method: string, ...args: any[]): Promise<any>;
}
