/**
 * @param {import('@/system/rpc').ServerEncodedTransport<any>} transport
 */
export default transport => {
	transport.onmessage = data => {
		try{
			const decoded = transport.decode(data);
			if(!('method' in decoded)) return; // to prevent problems using the same base transport as a client and a server
			const { id, method, args } = decoded;
			transport.call(method, args, (error, result) => transport.send(transport.encode(error ? { id, error } : { id, result })));
		} catch(e){}
	}
}
