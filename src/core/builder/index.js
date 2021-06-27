// @ts-ignore
import Worker from './worker?worker';
import createRPCClient from '@/system/rpc/client';
import encodeClientTransport from '@/system/rpc/encodings/null/client';
import createClientTransport from '@/system/rpc/transports/worker/client';

const worker = new Worker;
const callMethod = createRPCClient(encodeClientTransport(createClientTransport(worker)));

/**
 * @arg {string} moduleUrl
 * @arg {string} baseUrl
 */
export default async (moduleUrl, baseUrl) => {
    if(/^\.\.?\/./.test(moduleUrl)) moduleUrl = new URL(moduleUrl, baseUrl).toString();
    await callMethod('exec', moduleUrl);
}
