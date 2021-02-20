import { ServerTransport } from '@/system/rpc'

export default function createWorkerTransport(base: typeof globalThis, callMethod: ServerTransport<any>['call']): ServerTransport<any>
