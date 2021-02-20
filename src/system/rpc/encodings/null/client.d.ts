import { BaseTransport, ClientEncodedTransport } from '@/system/rpc'

/**
 * Creates null transport over the base transport for RPC controller
 */
export default function createNullRPCEncoding(transport: BaseTransport<any>): ClientEncodedTransport<any>
