// @ts-check
function emptyEncoding(data){
	return data
}

/**
 * @typedef {import('@/system/rpc').ServerTransport<any>} BaseTransport
 * @typedef {import('@/system/rpc').ServerEncodedTransport<any>} EncodedTransport
 */

/** @arg {BaseTransport} transport */
export default transport => {
	/** @type {EncodedTransport} */
	const encodedTransport = {
		encode: emptyEncoding,
		decode: emptyEncoding,
		send: data => transport.send(data),
		call: (...args) => transport.call(...args),
	};

	transport.onmessage = data => encodedTransport.onmessage(data)

	return encodedTransport
}
