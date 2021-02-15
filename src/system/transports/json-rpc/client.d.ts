import { ClientTransport, ClientEncodedTransport } from '@/system/transports'

/**
 * Creates JSON-RPC 2.0 transport over the base transport (for example, WS or HTTP) for a RPC controller
 */
export default function createJSONRPCTransport(transport: ClientTransport<string>): ClientEncodedTransport<string>
