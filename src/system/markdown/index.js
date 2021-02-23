// @ts-ignore
import Worker from './markdown?worker'
import createRPCServer from '@/system/rpc/server'
import createRPCClient from '@/system/rpc/client'
import encodeServerTransport from '@/system/rpc/encodings/null/server'
import encodeClientTransport from '@/system/rpc/encodings/null/client'
import createServerTransport from '@/system/rpc/transports/worker/server'
import createClientTransport from '@/system/rpc/transports/worker/client'
import { getApiUrl } from '@/system/api'
import { protocol } from '@/system/settings'

const worker = new Worker;

const callRPCMethod = createRPCClient(encodeClientTransport(createClientTransport(worker)));

/** @param {any[]} args */
export function render(...args){
	return callRPCMethod('render', ...args)
}

/** @param {any[]} args */
export function renderInline(...args){
	return callRPCMethod('renderInline', ...args)
}

const methods = {
	getApiUrl,
	getLocation(){
		return location.href
	},
	getProtocol(){
		return protocol
	},
}

createRPCServer(encodeServerTransport(createServerTransport(worker, async (method, args, callback) => {
	if(!(method in methods)) return callback(new Error('Cannot find method ' + method));
	try{
		callback(null, await methods[method](...args))
	} catch(e){
		callback(e)
	}
})));
