import createRPCServer from '@/system/rpc/server'
import encodeServerTransport from '@/system/rpc/encodings/null/server'
import createServerTransport from '@/system/rpc/transports/worker/server'

async function callMethod(baseLink, method, args){
    const post = !!args.length;
	let res;
	try{
		res = await fetch(`${baseLink}${encodeURIComponent(method)}`, {
			method: post ? 'POST' : 'GET',
			body: post ? JSON.stringify(args) : null,
		});
	} catch(e){
		// Network error
		throw e;
	}
	try{
		return await res.json();
	} catch(e){
		// API server error
		throw e;
	}
}

createRPCServer(encodeServerTransport(createServerTransport(self, async (method, args, callback) => {
	try{
		callback(null, await callMethod(args.shift(), method, args))
	} catch(e){
		callback(e)
	}
})));
