/** @typedef {import('@/system/rpc').ServerTransport<any>} ServerTransport */

/**
 * @arg {Worker} base
 * @arg {ServerTransport['call']} callMethod
 */
export default function createTransport(base, callMethod){
	/** @type {ServerTransport} */
	const res = {
		send(data){
			base.postMessage(data)
		},
		call: callMethod
	};
	base.addEventListener('message', ({ data }) => res.onmessage(data));
	return res
}
