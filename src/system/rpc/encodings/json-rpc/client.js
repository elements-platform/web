import { NamedError } from '@/system/helpers/errors'

class JSONRPCError extends NamedError{
	/** @arg {{ code: number, message: string, data?: { stack?: string } }} arg_0 */
	constructor({ code, message, data }){
		super(message);
		this.code = code;
		if(data?.stack){
			const stack = (this.stack || '').split('\n');
			const message = stack.shift();
			const prefix = '\n' + /^\s*\S+\s*/.exec(stack[0])[0];
			const remoteStack = ['', ...data.stack.split('\n')].join(prefix).slice(1);
			this.stack = [ message, remoteStack, ...stack ].join('\n');
		}
	}
}

/**
 * @typedef {import('@/system/rpc').BaseTransport<string>} BaseTransport
 * @typedef {import('@/system/rpc').ClientEncodedTransport<string>} EncodedTransport
 */

/** @arg {BaseTransport} transport */
export default transport => {
	/** @type {EncodedTransport} */
	const encodedTransport = {
		send,
		encode(data){
			const params = data.args;
			const fixed = Object.assign({ params, jsonrpc: '2.0' }, data);
			delete fixed.args;
			return JSON.stringify(fixed)
		},
		/** @arg {any} data */
		decode(data){
			const { jsonrpc, id, error, result } = data;
			if(jsonrpc !== '2.0') return {
				id,
				error: new JSONRPCError({
					code: -1,
					message: '"jsonrpc" field of the responce is not equivalent "2.0"'
				}),
			};
			if(error) return { id, error: new JSONRPCError(error) };
			return { id, result }
		},
	};
	let currentCallStack = [],
		callTimeoutHandler;

	transport.onmessage = data => {
		try{
			const res = JSON.parse(data);
			for(const r of Array.isArray(res) ? res : [ res ]) encodedTransport.onmessage(r)
		} catch(e){}
	}

	function sendStack(){
		const data = currentCallStack.length === 1 ? currentCallStack[0] : `[${currentCallStack.join(',')}]`;
		currentCallStack = [];
		transport.send(data)
	}

	/** @arg {string} data */
	function send(data){
		currentCallStack.push(data);
		clearTimeout(callTimeoutHandler);
		callTimeoutHandler = setTimeout(sendStack, 100);
	}

	return encodedTransport
}
