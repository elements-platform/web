import { AsyncIteratorWithPeriodFunction, createResolveablePromise } from '@/helpers/async'

/** @arg {number} x */
function reconnectPeriod(x){
	return x * (x / 2) * 1000
}

/**
 * @arg {string} url
 * @arg {(nextPeriod: number, reconnectImmidiately: () => void) => void} onNextReconnectPeriod
 * @arg {(reconnect: () => Promise<void>) => void} onReconnectCallback
 */
export default function createTransport(url, onNextReconnectPeriod, onReconnectCallback){
	let socket = createResolveablePromise(),
		isNotFirstTry = false;

	onReconnectCallback(async () => {
		(await socket).close();
		reconnectImmidiately()
	});

	/** @type {ReturnType<import('./client').default>} */
	const res = {
		async send(data){
			(await socket).send(data)
		}
	};

	// do async reconnects on error
	const socketIterator = new AsyncIteratorWithPeriodFunction(() => {
		return {
			done: false,
			value: new WebSocket(url),
		}
	}, reconnectPeriod);
	function reconnectImmidiately(){
		socketIterator.resetCounter();
		socketIterator.awakeImmidiately();
		isNotFirstTry = false;
	}
	(async () => {
		for await (const { value, nextPeriod } of socketIterator){
			if(isNotFirstTry) try{
				onNextReconnectPeriod(nextPeriod, reconnectImmidiately)
			} catch(e){} else {
				isNotFirstTry = true;
			}
			const lastResolver = socket;
			socket = createResolveablePromise();
			value.addEventListener('open', () => {
				socketIterator.resetCounter();
				lastResolver.resolve(value);
				socket.resolve(value);
			});
			value.addEventListener('message', ({ data }) => res.onmessage(data))
			await new Promise(r => value.addEventListener('close', r));
		}
	})();

	return res
}
