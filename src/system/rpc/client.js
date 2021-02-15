import rand from '@/system/rand'

/** @arg {import('@/system/transports').ClientEncodedTransport<string>} transport */
export default transport => {
	const resolvers = {};

	transport.onmessage = data => {
		try{
			const { result, error, id } = transport ? transport.decode(data) : data;
			if(id in resolvers){
				const { resolve, reject } = resolvers[id];
				delete resolvers[id];
				if(error) reject(error);
				else resolve(result);
			}
		} catch(e){}
	}

	async function call(method, id, args, resolve, reject){
		if(id) resolvers[id] = { resolve, reject };
		try{
			await transport.send(transport.encode({
				method,
				id,
				args,
			}));
		} catch(e){
			delete resolvers[id];
			reject(e);
		}
		if(!id) resolve();
	}

	return Object.assign(
		(method, ...args) => new Promise((resolve, reject) => call(method, rand(), args, resolve, reject)),
		{
			notify: (method, ...args) => new Promise((resolve, reject) => call(method, null, args, resolve, reject))
		}
	)
}
