import { BaseTransport, ClientEncodedTransport } from '@/system/rpc'

/**
 * Creates JSON-RPC 2.0 transport over the base transport (for example, WS, HTTP or Worker Messaging) for RPC controller
 */
export default function createJSONRPCEncoding(transport: BaseTransport<string>): ClientEncodedTransport<string>
