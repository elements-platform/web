import NamedError from '@/system/helpers/namedError'

class JSONRPCError extends NamedError{
	constructor({ code, message, data }){
		super(message);
		this.code = code;
		if(data?.stack){
			const stack = (this.stack || '').split('\n');
			const message = stack.shift();
			const prefix = '\n' + /^\s*\w+\s*/.exec(stack[0])[0];
			const remoteStack = ['', ...data.stack].join(prefix);
			this.stack = [ message, remoteStack, ...stack ].join('\n')
		}
	}
}

/**
 * @typedef {import('@/system/transports').ClientTransport<string>} BaseTransport
 * @typedef {import('@/system/transports').ClientEncodedTransport<string>} EncodedTransport
 */

/** @arg {BaseTransport} transport */
export default transport => {
	/** @type {EncodedTransport} */
	const encodedTransport = {
		send,
		encode(data){
			return JSON.stringify(data)
		},
		decode(data){
			const { id, error, result } = JSON.parse(data);
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
