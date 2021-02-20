// @ts-check
function emptyEncoding(data){
	return data
}

/**
 * @typedef {import('@/system/rpc').BaseTransport<any>} BaseTransport
 * @typedef {import('@/system/rpc').ClientEncodedTransport<any>} EncodedTransport
 */

/** @arg {BaseTransport} transport */
export default transport => {
	/** @type {EncodedTransport} */
	const encodedTransport = {
		encode: emptyEncoding,
		decode: emptyEncoding,
		send: data => transport.send(data),
	};

	transport.onmessage = data => encodedTransport.onmessage(data)

	return encodedTransport
}
