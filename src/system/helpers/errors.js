import globalStore from '@/system/global-store'

export class NamedError extends Error{
	constructor(message){
		super(message);
		this.name = Object.getPrototypeOf(this).constructor.name || 'Error'
	}
}

export function interceptErrors(func){
	return function(...args){
		try{
			return func.apply(this, args);
		} catch(e){
			globalStore.get('showError')(e);
			throw e;
		}
	}
}

export function interceptErrorsAsync(func){
	return async function(...args){
		try{
			return await func.apply(this, args);
		} catch(e){
			globalStore.get('showError')(e);
			throw e;
		}
	}
}
