import { ServerTransport, ServerEncodedTransport } from '@/system/rpc'

/**
 * Creates null transport over the base transport for RPC controller
 */
export default function createNullRPCEncoding(transport: ServerTransport<any>): ServerEncodedTransport<any>
