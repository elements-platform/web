import { BaseTransport } from '@/system/rpc'

export default function createWorkerTransport(worker: Worker): BaseTransport<any>
