/** @arg {Worker} worker */
export default function createTransport(worker){
	/** @type {import('@/system/rpc').BaseTransport<any>} */
	const res = {
		send(data){
			worker.postMessage(data)
		}
	};
	worker.addEventListener('message', ({ data }) => res.onmessage(data));
	return res
}
