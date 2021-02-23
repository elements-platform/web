import rand from '@/system/rand'

/** @arg {import('@/system/rpc').ClientEncodedTransport<any>} transport */
export default transport => {
	const resolvers = {},
		callbackResolvers = {};

	transport.onmessage = data => {
		try{
			const decoded = transport.decode(data);
			if(!('result' in decoded || 'error' in decoded)) return; // to prevent problems using the same base transport as a client and a server
			const { result, error, id } = decoded;
			if(id in resolvers || id in callbackResolvers){
				const { resolve, reject } = resolvers[id] || callbackResolvers[id];
				delete resolvers[id];
				if(error) reject(error);
				else resolve(result);
			}
		} catch(e){}
	}

	/**
	 * @param {string} method
	 * @param {string} id
	 * @param {any[]} args
	 * @param {(value: any) => void} resolve
	 * @param {(reason: Error) => void} reject
	 */
	async function call(method, id, args, resolve, reject, isCallback = false){
		if(isCallback) callbackResolvers[id] = { resolve, reject };
		else if(id) resolvers[id] = { resolve, reject };
		try{
			await transport.send(transport.encode({
				method,
				id,
				args,
			}));
		} catch(e){
			delete resolvers[id];
			delete callbackResolvers[id];
			reject(e);
		}
		if(!isCallback && !id) resolve();
	}

	return Object.assign(
		/**
		 * @param {string} method
		 * @param {any[]} args
		 */
		(method, ...args) => {
			const id = rand();
			if(typeof args[args.length - 1] === 'function'){
				const callback = args.pop();
				call(method, id, args, val => callback(null, val), err => callback(err));
				return
			}
			return new Promise((resolve, reject) => call(method, id, args, resolve, reject))
		},
		{
			/**
			 * @param {string} method
			 * @param {any[]} args
			 */
			notify: (method, ...args) => new Promise((resolve, reject) => call(method, null, args, resolve, reject))
		}
	)
}
