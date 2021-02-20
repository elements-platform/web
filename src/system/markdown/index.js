// @ts-check
// @ts-ignore
import Worker from './worker?worker'
import createRPCClient from '@/system/rpc/client'
import encodeTransport from '@/system/rpc/encodings/null/client'
import createTransport from '@/system/rpc/transports/worker/client'

const callRPCMethod = createRPCClient(encodeTransport(createTransport(new Worker)));

/**
 * @param {any[]} args
 */
export function render(...args){
	return callRPCMethod('render', ...args)
}

/**
 * @param {any[]} args
 */
export function renderInline(...args){
	return callRPCMethod('renderInline', ...args)
}
