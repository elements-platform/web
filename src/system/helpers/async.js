const immediateCallbackList = Object.create(null);

export function sleep(ms, onResolve = _ => {}){
	return new Promise(r => {
		onResolve(r);
		setTimeout(r, ms)
	})
}

export class AsyncIteratorWithPeriodFunction{
	#next
	#period
	#counter
	#currentSleepResolver
	/**
	 * @arg {() => any} next
	 * @arg {(i: number) => number} period
	 */
	constructor(next, period){
		this.#next = next;
		this.#period = period;
		this.resetCounter();
	}
	[Symbol.asyncIterator](){
		return {
			next: async () => {
				await sleep(this.#period(++this.#counter), r => this.#currentSleepResolver = r);
				const { done, value } = await this.#next();
				return {
					done,
					value: {
						nextPeriod: this.#period(this.#counter + 1),
						value,
					},
				}
			}
		}
	}
	resetCounter(){
		this.#counter = 0;
	}
	awakeImmidiately(){
		this.#currentSleepResolver()
	}
}

export function createResolveablePromise(){
	let resolve, reject;
	const p = new Promise(($, _) => {
		resolve = $;
		reject = _;
	});
	return Object.assign(p, { resolve, reject })
}

window.addEventListener('message', ({ data: id }) => {
	if(!(id in immediateCallbackList)) return;
	const [ callback, args ] = immediateCallbackList[id];
	delete immediateCallbackList[id];
	callback(...args)
});

export function setImmediate(callback, ...args){
	const id = Math.random();
	immediateCallbackList[id] = [ callback, args ];
	window.postMessage(id, '*');
	return id
}

export function clearImmediate(handler){
	delete immediateCallbackList[handler]
}
