// @ts-check
/**
 * @param {import('@/system/rpc').ServerEncodedTransport<any>} transport
 */
export default transport => {
	transport.onmessage = data => {
		try{
			const { id, method, args } = transport.decode(data);
			transport.call(method, args, (error, result) => transport.send(transport.encode(error ? { id, error } : { id, result })));
		} catch(e){}
	}
}
